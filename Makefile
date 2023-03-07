#!make:
include .env

version:
	@cat package.json | jq .version

image-build: 
	docker build . -t clientportal:$(APP_VERSION)

image-remote-login:
	aws ecr get-login-password --region $(AWS_REGION) --profile moldes | docker login --username AWS --password-stdin $(AWS_ACCOUNT).dkr.ecr.$(AWS_REGION).amazonaws.com

image-remote-tag: image-remote-login
	docker tag clientportal:$(APP_VERSION) $(AWS_ACCOUNT).dkr.ecr.$(AWS_REGION).amazonaws.com/clientportal:$(APP_VERSION)

image-publish:
	docker push $(AWS_ACCOUNT).dkr.ecr.$(AWS_REGION).amazonaws.com/clientportal:$(APP_VERSION)

app-version:
	jq '.version="$(APP_VERSION)"' package.json > package.json.new
	mv package.json.new package.json

git-package: 
	git add --all
	git commit -m 'Adding version $(APP_VERSION)'
	git tag "v$(APP_VERSION)" -m "updating to tag v$(APP_VERSION)"

git-publish:
	git push
	git push --tags

build: app-version image-build 

package: git-package image-remote-tag

publish: image-publish git-publish

all: build package publish