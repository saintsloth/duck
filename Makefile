watch-dev: watch-dev-backend watch-frontend
	-j2

watch-dev-backend:
	cd ./backend && npm run server:watch

watch-frontend:
	cd ./frontend && npm run start


lint: lint-backend lint-frontend

lint-backend:
	cd ./backend && npm run lint

lint-frontend:
	cd ./frontend && npm run lint

