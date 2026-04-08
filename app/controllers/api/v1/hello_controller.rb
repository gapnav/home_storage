module Api
  module V1
    class HelloController < ApplicationController
      def index
        render json: { data: { message: "Hello from Home Storage API!" } }
      end
    end
  end
end
