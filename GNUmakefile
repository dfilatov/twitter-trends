NODE_MODULES := ./node_modules/

BEM := $(NODE_MODULES).bin/bem
NPM := npm

GITHUB_REPO := git@github.com:dfilatov/twitter-trends.git
HEROKU_REPO := git@heroku.com:twitter-trends.git

ifneq (,$(findstring B,$(MAKEFLAGS)))
	BEM_FLAGS := --force
endif

.PHONY: bem-server
bem-server:: $(BEM)
	@$(BEM) server --port 3001

$(BEM):: $(NODE_MODULES)

$(NODE_MODULES)::
	$(debug ---> Updating npm dependencies)
	@$(NPM) install

.PHONY: app-dev
app-dev:
	supervisor -w lib,configs,desktop.bundles/index/index.blocks.js boot.js

.PHONY: app
app:
	node boot.js

.PHONY: deploy
deploy:
	rm -rf deploy
	mkdir deploy
	cd deploy; \
	git clone $(GITHUB_REPO) github; \
	git clone $(HEROKU_REPO) heroku; \
	cp -r github/{.bem,common.blocks,configs,desktop.{blocks,bundles},lib,Procfile,boot.js,package.json} heroku; \
	cd heroku; \
	rm -rf bem-bl bemhtml configs/current; \
	ln -s production configs/current; \
	$(NPM) install -d; \
	YENV=production $(BEM) make --force; \
	echo "node_modules\n.bem" > .gitignore; \
	git add .; \
	git ci -m "deploy"; \
	git push; \
	cd ../..

.PHONY: clean
clean::
	$(BEM) make -m clean
