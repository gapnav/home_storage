FROM ruby:3.4-slim

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      libpq-dev \
      postgresql-client \
      git \
      curl \
      libyaml-dev && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

WORKDIR /rails

ENV BUNDLE_PATH=/usr/local/bundle

COPY Gemfile Gemfile.lock* ./
RUN bundle install

COPY . .

RUN chmod +x bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["bin/docker-entrypoint.sh"]
