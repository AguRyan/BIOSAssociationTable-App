This directory contains a Jenkinsfile which can be used to build
BIOSAssociationTable-App using an OpenShift build pipeline.

To do this, run:

```bash
# create the nodejs example as usual
oc new-app https://github.com/AguRyan/BIOSAssociationTable-App

# now create the pipeline build controller from the openshift/pipeline
# subdirectory
oc new-app https://github.com/AguRyan/BIOSAssociationTable-App \
  --context-dir=openshift/pipeline --name BIOSAssociationTable-App-pipeline
```
