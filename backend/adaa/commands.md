docker exec -it laravel_app php artisan migrate
docker exec -it laravel_app php artisan serve
docker run --rm -v $(pwd)/adaa:/var/www -w /var/www composer require laravel/sanctum
docker run --rm -v $(pwd)/adaa:/var/www -w /var/www composer dump-autoload
docker compose run --rm composer
docker exec -it laravel_app php artisan make:controller AuthController
docker exec -it laravel_app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"