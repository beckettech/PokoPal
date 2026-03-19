#!/usr/bin/env python3
"""
Script to extract Pokemon locations from Serebii HTML files
"""

import json
import re
import os

def extract_locations_from_html(html_content):
    """Extract location data from a Serebii Pokemon Pokopia Pokedex page."""
    locations = []
    
    # Look for the location section - typically in a table
    # The pattern for locations in Serebii pages usually has location names in table cells
    
    # Find all location patterns - looking for map/area names
    # Common patterns: "Palette Town", "Cloud Island", "Withered Wastelands", etc.
    
    location_patterns = [
        r'Palette Town',
        r'Cloud Island',
        r'Withered Wastelands?',
        r'Bleak Beach',
        r'Rocky Ridges',
        r'Sparkling Skylands',
        r'Hot Spring Area'
    ]
    
    for pattern in location_patterns:
        if re.search(pattern, html_content, re.IGNORECASE):
            locations.append(pattern.replace('?', '').replace(r'', ''))
    
    return locations

def parse_locations_table(html_content):
    """Parse the locations table from Serebii HTML."""
    locations = []
    
    # Look for table rows with location data
    # Serebii typically uses tables with class or specific structure
    
    # Find the main content area and look for location mentions
    # Pattern: <td>Location Name</td> followed by <td>Yes/No or other indicator</td>
    
    # Extract all text that looks like a location
    location_keywords = [
        'Palette Town', 'Cloud Island', 'Withered Wasteland', 'Withered Wastelands',
        'Bleak Beach', 'Rocky Ridges', 'Sparkling Skylands', 'Hot Spring Area'
    ]
    
    for loc in location_keywords:
        if loc in html_content:
            # Check if there's a +N indicator (like +5)
            plus_pattern = loc + r'\s*\+\d+'
            match = re.search(plus_pattern, html_content)
            if match:
                locations.append(match.group())
            elif loc in html_content:
                locations.append(loc)
    
    return locations

def main():
    # Read the Geodude test file
    with open('/home/z/my-project/geodude-test.json', 'r') as f:
        data = json.load(f)
    
    html = data.get('data', {}).get('html', '')
    
    # Extract locations
    locations = parse_locations_table(html)
    
    print("Found locations:", locations)
    
    # Also search for specific patterns
    print("\nSearching for location patterns in HTML...")
    
    # Look for any table cells that might contain location info
    td_pattern = r'<td[^>]*>([^<]+)</td>'
    tds = re.findall(td_pattern, html)
    
    location_related = []
    location_names = ['palette', 'cloud', 'withered', 'bleak', 'rocky', 'sparkling', 'skyland', 'hot spring']
    
    for td in tds:
        td_lower = td.lower()
        if any(loc in td_lower for loc in location_names):
            location_related.append(td.strip())
    
    print("\nLocation-related table cells:", location_related[:20])

if __name__ == '__main__':
    main()
