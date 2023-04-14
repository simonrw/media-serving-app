.PHONY: dev
dev:
	pip-sync *requirements.txt

.PHONY: deploy-graphql-api
deploy-graphql-api:
	make -C graphql-api deploy

