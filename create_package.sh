rm -rf node_modules run-kit-minimal.zip
npm install
zip -x create_deployment.sh -r run-kit-minimal.zip *
aws s3 mv run-kit-minimal.zip s3://recastai-bot-hosting/run-kit-minimal.zip
