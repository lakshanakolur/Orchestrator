from flask import Flask,request
import requests
import json
import subprocess
import threading
import time
import yaml
import io

app = Flask(__name__)

with open("conf.yaml", 'r') as stream:
    conf = yaml.safe_load(stream)

num = 1
port = 0
initFlag = 0
nor = 0

def autoScaling():
    global port
    global nor
    while(True):
        time.sleep(conf["auto_scaling_time"])
        noc = (conf["auto_scaling_req"]/20) + 1
        nor = 0
        if(noc > port+1):
            while(noc != port+1):
                subprocess.check_call(["./contup.out",str(port+1)])
                port +=1
        if(noc < port+1):
            while(noc != port+1):
                subprocess.check_call(["./contdown.out",str(port)])
                port -=1

def faultTolerence():
    global port
    global nor
    while(True):
        time.sleep(conf["health_time"])
        r = ""
        headers = {"Content-Type": "application/json", "Accept": "application/json"}
        for i in range(0,port+1):
            try:
                fw_path = "http://" + "0.0.0.0" + ":" + conf["port_sub"] + str(i) + "/" + conf["health_check"]
                r = requests.get(fw_path, data=json.dumps({}), headers=headers)
                if(r.status_code == 500):
                    subprocess.check_call(["./contdown.out",str(i)])
                    print("Ressurecting")
                    print(fw_path)
                    subprocess.check_call(["./contup.out",str(i)])
            except:
                pass

@app.route("/<path:path>", methods=["GET", "POST", "DELETE"])
def home(path):
    global num
    global port
    global initFlag
    global nor
    if not path.startswith(tuple(conf["accp_routes"])):
        return "",404
    if(initFlag == 0):
        t1 = threading.Thread(target=autoScaling)
        t1.start()
        t2 = threading.Thread(target=faultTolerence)
        t2.start()
        initFlag = 1
    nor += 1
    try:
        temp = request.json
        try:
            temp = dict(request.json)
        except:
            temp = list(request.json)
    except:
        temp = {}
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    r = ""
    while(True):
        curr_port = (num % (port+1))
        num = num + 1
        fw_path = "http://" + "0.0.0.0" + ":" + conf["port_sub"] + str(curr_port) + "/" + path
        print(fw_path)
        if request.method == "GET":
            r = requests.get(fw_path, data=json.dumps(temp), headers=headers)
        elif request.method == "POST":
            r = requests.post(fw_path, data=json.dumps(temp), headers=headers)
        else:
            r = requests.delete(fw_path, data=json.dumps(temp), headers=headers)
        if r.status_code != 500:
            break
    return r.text, r.status_code

if __name__ == "__main__":
    print("All Hail Lord Sauron")
    subprocess.check_call(["./contup.out",str(0)])
    app.run(host='0.0.0.0', port=80)
