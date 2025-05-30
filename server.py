import pandas as pd # type: ignore
from fastapi import FastAPI, UploadFile, HTTPException 
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from fastapi.responses import FileResponse # type: ignore
import os 
from classify import classify

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # or ["*"] for all origins (less secure)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/classify/")
async def classify_logs(file: UploadFile):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV.")
    
    try:
        # Read the uploaded CSV
        df = pd.read_csv(file.file)
        print("csv file read")
        if "source" not in df.columns or "log_message" not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must contain 'source' and 'log_message' columns.")

        # Perform classification
        df["target_label"] = classify(list(zip(df["source"], df["log_message"])))
        
        print("Dataframe:",df.to_dict())

        # Save the modified file
        output_file = "resources/output.csv"
        df.to_csv(output_file, index=False)
        print("File saved to output.csv")
        return FileResponse(output_file,status_code=200,media_type='text/csv')
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        file.file.close()
        # Clean up if the file was saved
        
@app.get("/get-test")
async def get_test_csv():
    test_csv = "test/test.csv"
    return FileResponse(test_csv,status_code=200,media_type='text/csv')