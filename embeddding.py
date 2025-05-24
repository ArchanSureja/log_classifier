import joblib # type: ignore
from sentence_transformers import SentenceTransformer # type: ignore 

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
classification_model = joblib.load("models\log_classifier.joblib")

def classify_with_model(log_msg):
    embeddings = embedding_model.encode([log_msg])
    probabilites = classification_model.predict_proba(embeddings)[0]
    if max(probabilites)<0.5:
        return "Unclassified"
    predicted_label = classification_model.predict(embeddings)[0]
    return predicted_label

if __name__ == "__main__":
    logs = [
        "alpha.osapi_compute.wsgi.server - 12.10.11.1 - API returned 404 not found error",
        "GET /v2/3454/servers/detail HTTP/1.1 RCODE   404 len: 1583 time: 0.1878400",
        "System crashed due to drivers errors when restarting the server",
        "Hey bro, chill ya!",
        "Multiple login failures occurred on user 6454 account",
        "Server A790 was restarted unexpectedly during the process of data transfer"
    ]
    for log in logs:
        label = classify_with_model(log)
        print(log,"--",label)

