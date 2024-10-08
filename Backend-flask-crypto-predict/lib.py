import ccxt
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

# Initialize Binance exchange
exchange = ccxt.binance()
model = tf.keras.models.load_model("./trading_model.h5")


def fetch_real_time_data_binance(symbol, timeframe="1m"):
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=1)
    df = pd.DataFrame(
        ohlcv, columns=["timestamp", "open", "high", "low", "close", "volume"]
    )
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
    df[["open", "high", "low", "close", "volume"]] = df[
        ["open", "high", "low", "close", "volume"]
    ].astype(float)
    return df


def preprocess_real_time_data(df):
    scaler = MinMaxScaler(feature_range=(0, 1))
    df_scaled = scaler.fit_transform(df[["close"]])  # Scale only the 'close' price
    df_scaled = df_scaled.reshape(
        1, df_scaled.shape[0], 1, 1
    )  # Adjust shape for the model
    return df_scaled, scaler


def predict_price(model, input_data, scaler):
    # Make a prediction using the model
    predictions = model.predict(input_data)

    # Rescale the predictions to the original scale
    predictions_rescaled = scaler.inverse_transform(predictions).flatten()
    predicted_close = predictions_rescaled[-1]

    return predicted_close


def do_prediction(symbol):
    exchange_symbol = symbol + "/USDT"
    real_time_data = fetch_real_time_data_binance(exchange_symbol)
    input_data, scaler = preprocess_real_time_data(real_time_data)
    predicted_close = predict_price(model, input_data, scaler)
    return predicted_close


# symbol = "BTC"
# predicted_close = do_prediction(symbol)
# print(f"Predicted Close Price: {predicted_close}")
