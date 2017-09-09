##### init #####

# 初期インストール時に実行してください
install:
	git pull
	$(MAKE) depend
	$(MAKE) dev-depend
	$(MAKE) vendoring
	$(MAKE) gen
	cd front && npm install && npm run build
	$(MAKE) bindata
	$(MAKE) local

##### depend #####

# 実行に必要なパッケージのインストール
depend:
	go get -u github.com/goadesign/goa
	go get -u github.com/goadesign/goa/goagen
	go get -u github.com/jteeuwen/go-bindata/...
	go get -u github.com/deadcheat/goacors
	go get -u github.com/golang/dep/cmd/dep

# 開発者向けのパッケージのインストール
dev-depend:
	go get -u github.com/alecthomas/gometalinter
	gometalinter --install --update --force

# 依存パッケージをvendoringする
vendoring:
	dep ensure

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

build:
	goapp build -o goa-spa-sample ./server

lint:
	@if [ "`gometalinter ./... --config=lint_config.json | tee /dev/stderr`" ]; then \
		echo "^ - lint err" && echo && exit 1; \
	fi

local:
	cp -f ./server/env.yaml.dev ./server/env.yaml
	dev_appserver.py --datastore_path=./datastore ./server

staging-deploy:
	cp -f ./server/env.yaml.staging ./server/env.yaml
	goapp deploy -application enow-staging ./server

staging-rollback:
	appcfg.py rollback ./server -A enow-staging

##### etc ######

# tokenの詳細なチェックをせずに実行する
no-secure-local:
	cp -f ./server/env.yaml.dev.nosec ./server/env.yaml
	goapp serve ./server

# 簡易的なデプロイコマンド
pre-deploy:
	$(MAKE) gen
	cd front && npm install && npm run build
	cp -f ./server/env.yaml.staging ./server/env.yaml
	$(MAKE) staging-deploy

# gcpのプロジェクトを設定する
gcp-project-set:
	gcloud config set project enow-staging

# datastoreを初期化して実行する
delete-datastore:
	dev_appserver.py --clear_datastore=yes ./server

# search apiを初期化して実行する
delete-search-api:
	dev_appserver.py --clear_search_indexes=yes ./server

# Store周りを初期化して実行する
delete-run:
	dev_appserver.py --clear_datastore=yes --clear_search_indexes=yes ./server

# サーバーの更新を適用する
update:
	$(MAKE) vendoring
	$(MAKE) gen

# swaggerの実行画面をブラウザで開く
swaggerui:
	open http://localhost:8080/swaggerui/index.html

# configの設定
config-set:
	cp ./config/api.yaml.tmpl ./config/api.yaml
	cp ./config/oauth.yaml.tmpl ./config/oauth.yaml
