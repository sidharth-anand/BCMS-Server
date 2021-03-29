# Contributing to BCMS server

- Fork the repo and clone the fork locally
- Setup the original repo as an upstream (```git remote add upstream github.com/sidharth-anand/BCMS-server.git```)
- Create a branch for new issue/feature locally (``` git checkout -b new-feature ```)
- Develop on local branch
- Commit changes to your local issue branch (``` git add . && git commit -m "Commit message" ```)
- Download latest upstream master (``` git fetch upstream master ```)
- Update local master (``` git checkout master; git merge upstream/master ```)
- Rebase the your issue branch on top of the updated master (``` git checkout new-feature; git rebase master ```)
- Push the feature branch to your fork (``` git push origin new-feature ```)
- Submit pr from your-fork/new-feature to sidharth-anand/BCMS-server/master from github