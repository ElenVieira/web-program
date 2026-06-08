FROM golang:1.25-alpine AS builder

RUN apk add --no-cache gcc musl-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -o api .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/api .

RUN mkdir -p /app/data

EXPOSE 8080

CMD ["./api"]