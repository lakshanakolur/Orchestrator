import yaml
import io

with open("conf.yaml", 'r') as stream:
    conf = yaml.safe_load(stream)

path = "api/v1/categories/all"
print(type(conf["health_time"]))
print(type(6))

if path.startswith(tuple(conf["accp_routes"])):
    print("works")
