-- Worker service-area coordinates for proximity matching (nullable; backfilled from suburb).
ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8);

CREATE INDEX IF NOT EXISTS idx_worker_profiles_location
  ON worker_profiles (location_lat, location_lng)
  WHERE location_lat IS NOT NULL AND location_lng IS NOT NULL;

-- Backfill Lusaka suburb centroids (matches lib/lusaka/area-centroids.ts).
UPDATE worker_profiles
SET
  location_lat = CASE lower(trim(area))
    WHEN 'kabulonga' THEN -15.4167
    WHEN 'woodlands' THEN -15.4333
    WHEN 'roma' THEN -15.4083
    WHEN 'rhodes park' THEN -15.4000
    WHEN 'longacres' THEN -15.3944
    WHEN 'ibex hill' THEN -15.4278
    WHEN 'meanwood' THEN -15.3889
    WHEN 'kalundu' THEN -15.4111
    WHEN 'avondale' THEN -15.3833
    WHEN 'chainda' THEN -15.3611
    WHEN 'chelstone' THEN -15.3667
    WHEN 'chilenje' THEN -15.4444
    WHEN 'chudleigh' THEN -15.4222
    WHEN 'emmasdale' THEN -15.3556
    WHEN 'fairview' THEN -15.3778
    WHEN 'foxdale' THEN -15.4306
    WHEN 'handsworth park' THEN -15.4194
    WHEN 'jesmondine' THEN -15.4056
    WHEN 'kamwala' THEN -15.3889
    WHEN 'leopards hill' THEN -15.4500
    WHEN 'libala' THEN -15.4389
    WHEN 'lilayi' THEN -15.4722
    WHEN 'makeni' THEN -15.4611
    WHEN 'mass media' THEN -15.3972
    WHEN 'mutendere' THEN -15.3722
    WHEN 'new kasama' THEN -15.4056
    WHEN 'northmead' THEN -15.3917
    WHEN 'olympia' THEN -15.3833
    WHEN 'ridgeway' THEN -15.4250
    WHEN 'salama park' THEN -15.3583
    WHEN 'sunningdale' THEN -15.4139
    WHEN 'thorn park' THEN -15.4028
    WHEN 'woodlands extension' THEN -15.4417
    ELSE NULL
  END,
  location_lng = CASE lower(trim(area))
    WHEN 'kabulonga' THEN 28.3167
    WHEN 'woodlands' THEN 28.3000
    WHEN 'roma' THEN 28.2917
    WHEN 'rhodes park' THEN 28.2833
    WHEN 'longacres' THEN 28.3056
    WHEN 'ibex hill' THEN 28.3389
    WHEN 'meanwood' THEN 28.3278
    WHEN 'kalundu' THEN 28.3444
    WHEN 'avondale' THEN 28.3000
    WHEN 'chainda' THEN 28.3500
    WHEN 'chelstone' THEN 28.3833
    WHEN 'chilenje' THEN 28.3500
    WHEN 'chudleigh' THEN 28.2778
    WHEN 'emmasdale' THEN 28.3222
    WHEN 'fairview' THEN 28.2889
    WHEN 'foxdale' THEN 28.3194
    WHEN 'handsworth park' THEN 28.2861
    WHEN 'jesmondine' THEN 28.2694
    WHEN 'kamwala' THEN 28.2778
    WHEN 'leopards hill' THEN 28.3667
    WHEN 'libala' THEN 28.3611
    WHEN 'lilayi' THEN 28.3167
    WHEN 'makeni' THEN 28.2944
    WHEN 'mass media' THEN 28.3194
    WHEN 'mutendere' THEN 28.3667
    WHEN 'new kasama' THEN 28.3556
    WHEN 'northmead' THEN 28.2944
    WHEN 'olympia' THEN 28.3111
    WHEN 'ridgeway' THEN 28.3083
    WHEN 'salama park' THEN 28.3417
    WHEN 'sunningdale' THEN 28.3278
    WHEN 'thorn park' THEN 28.3028
    WHEN 'woodlands extension' THEN 28.3083
    ELSE NULL
  END
WHERE location_lat IS NULL;

-- Default remaining Lusaka workers to city centre.
UPDATE worker_profiles
SET location_lat = -15.4167, location_lng = 28.2833
WHERE location_lat IS NULL
  AND lower(trim(city)) = 'lusaka';
