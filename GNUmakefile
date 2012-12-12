NODE_MODULES := ./node_modules/

BEM := $(NODE_MODULES).bin/bem
NPM := npm

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

.PHONY: app-production
app-production:
	rm configs/current
	ln -s production configs/current
	$(BEM) make --force
	node boot.js

.PHONY: clean
clean::
	$(BEM) make -m clean
