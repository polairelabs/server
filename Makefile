ifneq (,$(wildcard ./.env))
    include .env
    export
endif

init:
	cp .env.dist .env
serve:
	npm run start