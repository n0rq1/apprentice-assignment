# How to Containerize a Node.js App & Deploy it to GCR
### Containerizing The Application Using Docker
  - Dockerfile
  - Docker Image
  - Docker Container
### Pushing the Docker Image to Docker Hub
  - Format tag
  - Push to Docker Hub
### Deploying to Google Cloud Run
  - Setup GCR to pull the image and deploy!
### Automating with GitHub Actions

<br></br>
<br></br>

### Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "index.js"]
```

### Workflow.yml
```yaml
name: Workflow for Liatrio Take Home Assignment 

on:
  push:
    branches: ["main", "demo"]

jobs: 
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t liatrio .

      - name: Run Docker container
        run: docker run -d -p 80:80 liatrio

      - name: Run Liatrio tests
        uses: liatrio/github-actions/apprentice-action@v1.0.0

  create-release-version:
    runs-on: ubuntu-latest
    needs: run-test
    outputs:
      version: ${{ steps.get_version.outputs.VERSION }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Semantic Release
        id: semantic
        uses: cycjimmy/semantic-release-action@v4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Save version for Docker tag
        id: get_version
        run: echo "VERSION=${{ steps.semantic.outputs.new_release_version }}" >> $GITHUB_OUTPUT

  push-image:
    runs-on: ubuntu-latest
    needs: create-release-version
    outputs:
      version: ${{ needs.create-release-version.outputs.version }}
       
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Build Docker image
        run: docker build -t liatrio .

      - name: Log in to Docker Hub
        run: echo ${{ secrets.DOCKER_PASSWORD }} | docker login --username ${{ secrets.DOCKER_USERNAME }} --password-stdin

      - name: Push Docker image to Docker Hub
        env:
          VERSION: ${{ needs.create-release-version.outputs.version }}
        run: |
          docker tag liatrio ${{ secrets.DOCKER_USERNAME }}/liatrio:${{ needs.create-release-version.outputs.version }}
          docker push ${{ secrets.DOCKER_USERNAME }}/liatrio:${{ needs.create-release-version.outputs.version }}

  deploy:
    runs-on: ubuntu-latest
    needs: push-image

    steps:
      - name: Google Auth
        uses: 'google-github-actions/auth@v2'
        with:
          credentials_json: '${{ secrets.GCP_CREDS_DEMO }}'

      - name: Deploy to Cloud Run
        id: deploy
        uses: 'google-github-actions/deploy-cloudrun@v2'
        with:
          service: 'liatrio-demo'
          region: us-central1
          image: 'docker.io/${{ secrets.DOCKER_USERNAME }}/liatrio:${{ needs.push-image.outputs.version }}'
```

### .releaserc.json
```js
{
    "branches": ["main", "demo"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/github"
    ]
}
```

### Semantic Release Version
![]()