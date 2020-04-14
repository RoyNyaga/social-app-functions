# export GOOGLE_APPLICATION_CREDENTIALS="/home/nyaga/Downloads/socialape-f403e-7541ae412dc2.json"

project_id = "socialape-f403e"

require "google/cloud/storage"

# If you don't specify credentials when constructing the client, the client
# library will look for credentials in the environment.
storage = Google::Cloud::Storage.new project: project_id

# Make an authenticated API request
storage.buckets.each do |bucket|
  puts bucket.name
end