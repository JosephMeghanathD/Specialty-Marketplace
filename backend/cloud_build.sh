#!/bin/sh

# This script builds and pushes Docker images for the Specialty Marketplace services.
#
# Usage:
#   ./cloud-build.sh          (Builds and pushes ALL services)
#   ./cloud-build.sh --user   (Builds and pushes ONLY user-service)
#   ./cloud-build.sh --product (Builds and pushes ONLY product-service)
#

set -e

# --- Configuration Check ---
if [ -z "$PROJECT_ID" ] || [ -z "$REGION" ]; then
  echo "Error: Please set the PROJECT_ID and REGION environment variables."
  exit 1
fi

# --- Argument Parsing ---
SERVICES_TO_BUILD=("user-service" "product-service")

if [ -n "$1" ]; then
  case "$1" in
    --user)
      SERVICES_TO_BUILD=("user-service")
      echo "✅ Targeted build: Preparing to build ONLY user-service."
      ;;
    --product)
      SERVICES_TO_BUILD=("product-service")
      echo "✅ Targeted build: Preparing to build ONLY product-service."
      ;;
    *)
      echo "Error: Invalid argument '$1'. Usage: $0 [--user | --product]"
      exit 1
      ;;
  esac
else
    echo "✅ Default build: Preparing to build ALL services."
fi

# --- Main Build Loop ---
TAG="latest"
REPO_NAME="specialty-marketplace-repo" # Using a new repo name for this project

for SERVICE in "${SERVICES_TO_BUILD[@]}"
do
  echo ""
  echo "======================================================="
  echo "--- Building and Pushing: $SERVICE for linux/amd64 ---"
  echo "======================================================="

  # Determine the directory for the service.
  SERVICE_DIR=""
  case $SERVICE in
    user-service) SERVICE_DIR="userservice" ;;
    product-service) SERVICE_DIR="productorderservice" ;;
  esac

  cd ./$SERVICE_DIR || exit

  echo "--> Running ./gradlew build for $SERVICE"
  ./gradlew clean build

  IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE}:${TAG}"

  echo "--> Building and pushing Docker image: ${IMAGE_NAME}"
  docker buildx build --platform linux/amd64 -t "${IMAGE_NAME}" --push .

  cd ..
  echo "--- Finished $SERVICE ---"
done

echo ""
echo "✅ Build and push process completed successfully for selected services."