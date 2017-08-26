##### init #####

install:
	git pull
	$(MAKE) depend
	$(MAKE) devDepend
	$(MAKE) vendoring
	$(MAKE) gen
	cd front && npm install && npm run build
	$(MAKE) bindata
	$(MAKE) local

##### depend #####

depend:
	go get -u github.com/goadesign/goa
	go get -u github.com/goadesign/goa/goagen
	go get -u github.com/jteeuwen/go-bindata/...
	go get -u github.com/Masterminds/glide
	go get -u github.com/deadcheat/goacors

devDepend:
	go get -u github.com/alecthomas/gometalinter
	gometalinter --install --update --force

vendoring:
	rm -rf ./vendor
	glide install

##### goa ######

REPO:=github.com/enow-dev/enow

init: depend bootstrap
gen: clean generate

bootstrap:
	goagen bootstrap -d $(REPO)/design

main:
	goagen main -d $(REPO)/design

clean:
	rm -rf app
	rm -rf client
	rm -rf tool
	rm -rf swagger
	rm -rf schema
	rm -rf js
	rm -f build

generate:
	goagen app     -d $(REPO)/design
	goagen swagger -d $(REPO)/design -o server
	goagen client -d $(REPO)/design

swaggerUI:
	open http://localhost:8080/swagger/index.html

run:
	go run main.go

build:
	goapp build -o goa-spa-sample ./server

lint:
	@if [ "`gometalinter ./... --config=lint_config.json | tee /dev/stderr`" ]; then \
		echo "^ - lint err" && echo && exit 1; \
	fi

local:
	cp -f ./server/dev.yaml.tmpl2 ./server/dev.yaml
	goapp serve ./server

staging-deploy:
	goapp deploy -application enow-staging ./server

staging-rollback:
	appcfg.py rollback ./server -A enow-staging

##### etc ######

no-secure-local:
	cp -f ./server/dev.yaml.tmpl ./server/dev.yaml
	goapp serve ./server

preDeploy:
	$(MAKE) gen
	cd front && npm install && npm run build
	$(MAKE) staging-deploy

gcp-project-set:
	gcloud config set project enow-staging
