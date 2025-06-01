# --- Stage 1: Build ---
    FROM node:20-alpine AS builder

    # Install dependencies
    RUN npm install -g pnpm
    
    # Set working directory
    WORKDIR /app
    
    # Copy files
    COPY . .
    
    # Install project dependencies
    RUN pnpm install
    
    # Build the app
    RUN pnpm build
    
    # --- Stage 2: Run ---
    FROM node:20-alpine AS runner
    
    # Install pnpm
    RUN npm install -g pnpm
    
    # Set working directory
    WORKDIR /app
    
    # Copy built app and necessary files from builder
    COPY --from=builder /app/build ./build
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/pnpm-lock.yaml ./
    COPY --from=builder /app/.env ./
    
    # Install only production dependencies
    RUN pnpm install --prod
    
    # Expose port (defaults to 3000, can be changed via .env)
    EXPOSE 3000
    
    # Start the server
    CMD ["node", "build"]
    