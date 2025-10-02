# PaperTrail Deployment Guide

This guide explains how to deploy PaperTrail using Docker on any cloud platform.

## Prerequisites

- Docker installed (v20.10+)
- Docker Compose installed (v2.0+)
- Your environment variables ready

## Quick Start (Local Testing)

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Edit .env file with your actual values:**
```bash
nano .env  # or use your preferred editor
```

3. **Run the database migration:**
```bash
npm run db:push
```

4. **Build and start services:**
```bash
docker-compose up --build
```

5. **Access the application:**
Open http://localhost:3000

## Production Deployment

### Option 1: Any Cloud with Docker Support

**AWS (ECS, EC2), Google Cloud (Cloud Run, GCE), Azure (Container Instances), DigitalOcean, etc.**

1. **Build the Docker image:**
```bash
docker build -t papertrail:latest .
```

2. **Tag for your registry:**
```bash
# For Docker Hub
docker tag papertrail:latest yourusername/papertrail:latest

# For AWS ECR
docker tag papertrail:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/papertrail:latest

# For Google Container Registry
docker tag papertrail:latest gcr.io/your-project/papertrail:latest
```

3. **Push to registry:**
```bash
docker push yourusername/papertrail:latest
```

4. **Deploy using your cloud provider's tools:**
   - AWS ECS: Use task definitions
   - Google Cloud Run: `gcloud run deploy`
   - Azure: `az container create`
   - DigitalOcean: Use App Platform or Droplets

### Option 2: Using Docker Compose on a Server

1. **SSH into your server:**
```bash
ssh user@your-server.com
```

2. **Clone your repository:**
```bash
git clone https://github.com/yourusername/papertrail.git
cd papertrail
```

3. **Set up environment:**
```bash
cp .env.example .env
nano .env  # Add your production values
```

4. **Run database migrations:**
```bash
docker-compose run --rm app npm run db:push
```

5. **Start services in detached mode:**
```bash
docker-compose up -d
```

6. **Check logs:**
```bash
docker-compose logs -f
```

### Option 3: Kubernetes (K8s)

Create Kubernetes manifests (example):

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: papertrail
spec:
  replicas: 2
  selector:
    matchLabels:
      app: papertrail
  template:
    metadata:
      labels:
        app: papertrail
    spec:
      containers:
      - name: papertrail
        image: yourusername/papertrail:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: papertrail-secrets
              key: database-url
        # Add other env vars...
```

Deploy:
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your application URL
- `GEMINI_API_KEY` - Google Gemini API key

**Optional:**
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `RESEND_API_KEY` - For email functionality
- `AZURE_OPENAI_API_KEY` - If using Azure OpenAI
- `HUGGINGFACE_API_KEY` - If using HuggingFace embeddings

## Database Setup

### Using Managed Database (Recommended for Production)

Use a managed PostgreSQL service:
- **AWS**: RDS PostgreSQL
- **Google Cloud**: Cloud SQL for PostgreSQL
- **Azure**: Database for PostgreSQL
- **DigitalOcean**: Managed Databases
- **Neon**: Serverless PostgreSQL (current setup)

Update `DATABASE_URL` in .env with your managed database connection string.

### Using Docker Postgres (Development/Testing)

The docker-compose.yml already includes PostgreSQL. Data persists in a Docker volume.

## Health Checks

The application includes health check endpoints:

- **App health**: `GET /api/health` (you'll need to create this)
- **Database health**: Checked via Docker Compose

## Scaling

### Horizontal Scaling

1. **Using Docker Compose:**
```bash
docker-compose up -d --scale app=3
```

2. **Using Kubernetes:**
```bash
kubectl scale deployment papertrail --replicas=5
```

3. **Using Cloud Provider Auto-scaling:**
Configure auto-scaling in your cloud provider dashboard.

### Database Scaling

- Use connection pooling (already configured in Drizzle)
- Use read replicas for read-heavy workloads
- Consider PostgreSQL clustering for high availability

## Monitoring

Add monitoring tools:
```bash
# Prometheus + Grafana
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

## Backup

### Database Backup

```bash
# Automated backup script
docker-compose exec postgres pg_dump -U papertrail papertrail > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
docker-compose exec -T postgres psql -U papertrail papertrail < backup_20250102.sql
```

## Troubleshooting

**Container won't start:**
```bash
docker-compose logs app
```

**Database connection issues:**
```bash
docker-compose exec postgres psql -U papertrail -d papertrail
```

**Clear everything and restart:**
```bash
docker-compose down -v
docker-compose up --build
```

## Security Checklist

- [ ] Use strong DATABASE_URL password
- [ ] Generate secure NEXTAUTH_SECRET
- [ ] Enable HTTPS in production
- [ ] Use environment variables for all secrets
- [ ] Enable firewall rules (only allow 80/443)
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Monitor logs for suspicious activity

## Cloud-Specific Notes

### AWS
- Use ECS with Fargate for serverless containers
- Use RDS for PostgreSQL
- Use Application Load Balancer
- Store secrets in AWS Secrets Manager

### Google Cloud
- Use Cloud Run for fully managed containers
- Use Cloud SQL for PostgreSQL
- Use Cloud Load Balancing
- Store secrets in Secret Manager

### Azure
- Use Azure Container Instances or App Service
- Use Azure Database for PostgreSQL
- Use Application Gateway
- Store secrets in Key Vault

### DigitalOcean
- Use App Platform for easy deployment
- Use Managed Databases
- Use Load Balancers
- Built-in SSL certificates

## Support

For issues, check:
1. Application logs: `docker-compose logs -f app`
2. Database logs: `docker-compose logs -f postgres`
3. Environment variables: `docker-compose config`

---

**Your application is now cloud-agnostic and ready to deploy anywhere!**
