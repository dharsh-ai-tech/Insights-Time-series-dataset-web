import pandas as pd

def process_dataset(df):
    df.columns = [col.strip().lower() for col in df.columns]

    if 'datetime' not in df.columns:
        raise ValueError("Missing 'datetime' column in dataset.")

    df['datetime'] = pd.to_datetime(df['datetime'], errors='coerce')
    df.dropna(subset=['datetime'], inplace=True)
    df.set_index('datetime', inplace=True)

    insights = {}

    for freq, label in zip(['D', 'W', 'M', 'Y'], ['day', 'week', 'month', 'year']):
        grouped = df.resample(freq).mean(numeric_only=True).round(2)
        grouped.index = grouped.index.strftime('%Y-%m-%d')
        insights[label] = grouped.to_dict()

    return insights
