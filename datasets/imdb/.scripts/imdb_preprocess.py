"""
This script preprocess the film dataset to make it ready for class interaction.

The result dataset is meant to fulfill the following criteria:
- 2 numeric colums with different ranges
- 1 binary column
- 1 categorical column (more than 2 categories)
- 1 numeric class column
- No more than 20 rows

The dataset used is 250IMDB (250 most rated movies in IMDb):
https://www.kaggle.com/datasets/rajugc/imdb-top-250-movies-dataset

The dataset result is upload in the repository as imdb.csv

@author: jparisu

@note: this script assumes you have the dataset downloaded locally as original_imdb.csv
This is to avoid the extra space required in the repository
"""

import pandas as pd
import numpy as np
import seaborn as sns

###############################################################################

def convert_to_numeric(value):
    # Remove dollar sign and commas
    value = value.replace('$', '').replace(',', '')
    # If the value is not a digit, return NaN
    if not value.isdigit():
        return np.nan
    return int(value)

# Equivalent genres
genre_transformation = {
    'Adventure': 'Action',
    'Animation': 'Family',
    'Biography': 'History',
    'Crime': 'Action',
    'Documentary': 'History',
}

def translation_genre(genre):
    """Transform a genre to its equivalent"""
    if genre in genre_transformation:
        return genre_transformation[genre]
    return genre

def transform_genre_list(genre_list):
    """Transform a list of genres"""
    return ','.join({translation_genre(genre) for genre in genre_list})

def valid_genre(movie_genres, valid_genres):
    """Check if a movie has exactly one valid genre"""
    valid = 0
    for genre in movie_genres.split(','):
        if genre in valid_genres:
            valid += 1
    return valid == 1

def get_valid_genre(movie_genres, valid_genres):
    """Get the valid genre of a movie (assuming has only one)"""
    for genre in movie_genres.split(','):
        if genre in valid_genres:
            return genre
    return None

###############################################################################

# Define the filters
genres = ['History', 'Sci-Fi', 'Comedy']
years = [2008, 2024]
children_cert = ['G', 'PG', 'PG-13']

###############################################################################

# Load the IMDb dataset
db_original = pd.read_csv('original_imdb.csv')


# Create a copy of the original DataFrame
df = db_original.copy()

# Transform genre list
df['genre'] = df['genre'].apply(lambda x: transform_genre_list(x.split(',')))

# Filter films by genre
filtered_genre = df[df['genre'].apply(lambda x: valid_genre(x, genres))]

# Filter films between two years
filtered_years = filtered_genre[(filtered_genre['year'] >= years[0]) & (filtered_genre['year'] <= years[1])]

# Create new column 'genre' with filtered values
filtered_years['theme'] = filtered_years['genre'].apply(lambda x: get_valid_genre(x, genres))

# Create new column 'children' based on certificate
filtered_years['adult'] = filtered_years['certificate'].apply(lambda x: 'no' if x in children_cert else 'yes')

# Convert budget and box_office to numeric
filtered_years['budget'] = filtered_years['budget'].apply(convert_to_numeric)
filtered_years['box_office'] = filtered_years['box_office'].apply(convert_to_numeric)

# Remove NaN values
filtered_years.dropna(subset=['budget', 'box_office'], inplace=True)

# Select required columns
result = filtered_years[['name', 'year', 'theme', 'adult', 'budget', 'box_office']]

###############################################################################

# Save the result
result.to_csv('../imdb.csv', index=False)
