docker exec -it laravel_app php artisan migrate
docker exec -it laravel_app php artisan serve
docker run --rm -v $(pwd):/var/www -w /var/www composer require laravel/sanctum
docker compose run --rm composer