#!/bin/sh

# This script deploys the Specialty Marketplace microservices to Google Cloud Run,
# making them publicly accessible from the internet.
#
# Usage:
#   ./cloud-deploy-public.sh          (Deploys ALL services)
#   ./cloud-deploy-public.sh --user   (Deploys ONLY user-service)
#   ./cloud-deploy-public.sh --product (Deploys ONLY product-service)
#

set -e

# --- Configuration Check ---
if [ -z "$PROJECT_ID" ] || [ -z "$REGION" ]; then
  echo "Error: Please set the PROJECT_ID and REGION environment variables first."
  exit 1
fi

# --- Argument Parsing ---
SERVICES_TO_DEPLOY=("user-service" "product-service")
if [ -n "$1" ]; then
  case "$1" in
    --user) SERVICES_TO_DEPLOY=("user-service") ;;
    --product) SERVICES_TO_DEPLOY=("product-service") ;;
    *)
      echo "Error: Invalid argument '$1'. Usage: $0 [--user | --product]"
      exit 1
      ;;
  esac
fi

echo "Deploying public services to Project: '$PROJECT_ID' in Region: '$REGION'"
echo "---"

# --- Main Deployment Loop ---
REPO_NAME="specialty-marketplace-repo"

for SERVICE in "${SERVICES_TO_DEPLOY[@]}"
do
  echo ""
  echo "============================================="
  echo "--- Publicly Deploying: $SERVICE ---"
  echo "============================================="

  # Determine service-specific configuration
  PORT=""
  SERVICE_ACCOUNT_EMAIL=""
  case $SERVICE in
    user-service)
      PORT="8081"
      SERVICE_ACCOUNT_EMAIL="user-service-sa@${PROJECT_ID}.iam.gserviceaccount.com"
      ;;
    product-service)
      PORT="8082"
      SERVICE_ACCOUNT_EMAIL="product-service-sa@${PROJECT_ID}.iam.gserviceaccount.com"
      ;;
    *)
      echo "Error: Unknown service '$SERVICE' in the case statement."
      exit 1
      ;;
  esac

  gcloud run deploy "$SERVICE" \
    --image="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE}:latest" \
    --service-account="$SERVICE_ACCOUNT_EMAIL" \
    --port="$PORT" \
    --ingress=all \
    --allow-unauthenticated \
    --region="$REGION"
done

echo ""
echo "============================================="
echo "✅ Deployment process completed successfully for selected services."
echo "============================================="