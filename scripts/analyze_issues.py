import pandas as pd
import os

def analyze_issues(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        return

    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return

    # Ensure required columns exist (adjust column names as necessary based on your actual CSV)
    required_columns = ['issue_type', 'level', 'url', 'status_code']
    if missing_columns := [
        col for col in required_columns if col not in df.columns
    ]:
        # Fallback logic or warning if columns don't match exactly what's expected
        print(f"Warning: Missing expected columns: {missing_columns}. Please check your CSV structure.")
        # We will try to proceed if possible, but likely will fail on specific operations
        if 'issue_type' not in df.columns or 'level' not in df.columns:
             print("Cannot perform issue type analysis without 'issue_type' and 'level' columns.")
             return

    # 1. Filter and count occurrences of 'issue_type' where 'level' is 'Error' or 'Warning'
    print("--- Issue Type Counts (Errors & Warnings) ---")
    filtered_df = df[df['level'].isin(['Error', 'Warning'])]

    if not filtered_df.empty:
        issue_counts = filtered_df['issue_type'].value_counts()
        print(issue_counts)
    else:
        print("No issues found with level 'Error' or 'Warning'.")
    print("\n")

    # 2. Display the top 20 URLs that returned a 404 status code
    print("--- Top 20 URLs with 404 Status Code ---")

    # Check if status_code column exists
    if 'status_code' in df.columns and 'url' in df.columns:
        # Ensure status_code is treated numerically if possible, or string match
        # Some CSVs might have status_code as float or string

        # Filter for 404. We handle potential string/int differences.
        four_oh_four_df = df[df['status_code'].astype(str).str.contains('404', na=False)]

        if not four_oh_four_df.empty:
            top_404_urls = four_oh_four_df['url'].value_counts().head(20)
            print(top_404_urls)
        else:
            print("No URLs found with 404 status code.")
    else:
        print("Cannot perform 404 analysis without 'url' and 'status_code' columns.")

    # 3. Filter rows where 'redirect_chain_length' is greater than 1 and export
    print("\n--- Analyzing Redirect Chains ---")
    if 'redirect_chain_length' in df.columns and 'url' in df.columns and 'status_code' in df.columns:
        # Ensure redirect_chain_length is numeric
        df['redirect_chain_length'] = pd.to_numeric(df['redirect_chain_length'], errors='coerce')

        redirect_df = df[df['redirect_chain_length'] > 1].copy()

        if not redirect_df.empty:
            _extracted_from_analyze_issues_64(redirect_df)
        else:
            print("No redirect chains with length > 1 found.")
    else:
        print("Cannot perform redirect analysis. Missing one of: 'redirect_chain_length', 'url', 'status_code'.")


# TODO Rename this here and in `analyze_issues`
def _extracted_from_analyze_issues_64(redirect_df):
    # Select specific columns
    result_df = redirect_df[['url', 'redirect_chain_length', 'status_code']]

    # Sort by chain length in descending order
    result_df = result_df.sort_values(by='redirect_chain_length', ascending=False)

    # Export to CSV
    output_file = 'critical_redirects.csv'
    result_df.to_csv(output_file, index=False)
    print(f"Found {len(result_df)} critical redirects. Exported to '{output_file}'.")
    print(result_df.head()) # Display first few rows

if __name__ == "__main__":
    # Assuming issues.csv is in the current directory or provide absolute path
    csv_file = 'issues.csv' 
    analyze_issues(csv_file)
