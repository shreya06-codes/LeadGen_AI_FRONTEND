from fastapi import FastAPI

app = FastAPI(
    title="AURXON Backend",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to AURXON Backend!"
    }

@app.get("/health")
def health():
    return {
        "status": "Running"
    }