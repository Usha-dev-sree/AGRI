import numpy as np
from sklearn.cluster import KMeans

def cluster_farm_waste(farms_data: list, n_clusters: int = 3) -> dict:
    """
    Performs spatial K-Means clustering on farm coordinates to optimize bulk logistics
    """
    if not farms_data or len(farms_data) < n_clusters:
        return {"success": False, "message": "Insufficient farm records for clustering"}

    coordinates = []
    for f in farms_data:
        lat = f.get("lat", 17.3850)
        lng = f.get("lng", 78.4867)
        coordinates.append([lat, lng])

    X = np.array(coordinates)
    k = min(n_clusters, len(coordinates))
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X)
    centers = kmeans.cluster_centers_

    clusters = []
    for cluster_id in range(k):
        members = [farms_data[i] for i in range(len(farms_data)) if labels[i] == cluster_id]
        total_qty = sum(m.get("quantity", 0) for m in members)
        clusters.append({
            "clusterId": cluster_id + 1,
            "center": {"lat": float(centers[cluster_id][0]), "lng": float(centers[cluster_id][1])},
            "farmCount": len(members),
            "totalWasteKg": total_qty,
            "farms": members
        })

    return {
        "success": True,
        "clustersCount": k,
        "clusters": clusters
    }
