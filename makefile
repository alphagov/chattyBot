# makefile for circuits_2.0
image := europe-west2-docker.pkg.dev/gaf-gds-acronym-finder/gaf/gaf-chat
PORT ?= 3000

.PHONY: docker-build gcloud-build

deploy: docker-build gcloud-build

local-init:
	gcloud config set project gaf-gds-acronym-finder
	gcloud auth login
	npm install

local-dev:
	npm run dev

docker-build:
	docker build -t $(image) .

docker-run:
	docker run -p 8000:$(PORT) -v ~/.config:/root/.config $(image)

docker-clean:
	docker container prune -f

gcloud-build:
	gcloud builds submit --tag $(image)

cloud-push:
	docker push $(image)