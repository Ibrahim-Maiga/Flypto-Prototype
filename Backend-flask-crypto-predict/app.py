from flask import Flask, request, jsonify
from lib import do_prediction

app = Flask(__name__)


@app.route("/predict", methods=["GET"])
def predict():
    symbol = request.args.get("symbol")

    if not symbol:
        return jsonify({"error": "Symbol parameter is required"}), 400

    try:
        # Call the prediction function from lib.py
        predicted_value = do_prediction(symbol)

        # Return the predicted value as a JSON response
        return jsonify({"symbol": symbol, "predicted_value": str(predicted_value)})

    except Exception as e:
        # Handle exceptions and return an error message
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
