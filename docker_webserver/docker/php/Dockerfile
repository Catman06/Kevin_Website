# from https://www.fadocodecamp.com/posts/docker-php-nginx-complete-guide#docker-images-vs-containers
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
	git \
	curl \
	libpng-dev \
	libonig-dev \
	libxml2-dev \
	libzip-dev \
	libicu-dev \
	libpq-dev \
	zip \
	unzip

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install \
	pdo_pgsql \
	mbstring \
	exif \
	pcntl \
	bcmath \
	gd \
	intl \
	zip \
	opcache

RUN pecl install redis && docker-php-ext-enable redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

WORKDIR /var/www

CMD ["php-fpm"]

EXPOSE 9000
