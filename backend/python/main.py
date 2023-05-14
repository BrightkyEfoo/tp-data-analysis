# bartlett test
import math
import scipy.stats as stats
import json
from statistique_simple import Echantillon
from statistique_simple import khi_deux
# import json


echantillons = [
    # Echantillon.Echantillon([4, 7, 6, 6]),
    # Echantillon.Echantillon([5, 1, 3, 5, 3, 4]),
    # Echantillon.Echantillon([8, 6, 8, 9, 5]),
    # Echantillon.Echantillon([8, 6, 8, 9, 5, 8, 5, 5]),
    # Echantillon.Echantillon([8, 5])
]
# Opening JSON file

f = open('../DEV-IN3/data-analysis/backend/shared/tmp.json')
data = json.loads(f.read())

for i in data["echantillons"]:
    echantillons.append(Echantillon.Echantillon(i['elements']))

# print(echantillons)
print(data)
seuil_signification = data["seuil"]
print(seuil_signification)
# nombre d'echantillons

k = len(echantillons)
if k > 2:
    N = sum([e.taille for e in echantillons])

    variance_p = sum([(e.taille - 1)*e.variance for e in echantillons]) / (N - k)

    B1 = (N - k)*math.log10(variance_p) - sum([(e.taille - 1)*math.log10(e.variance) for e in echantillons])

    B2 = 1 + (sum([1/(e.taille - 1) for e in echantillons]) - 1/(N - k)) / (3 * (k - 1))

    k_observe = 2.3026 * B1 / B2

    print(f"k observe = {k_observe}")

    k_theorique = khi_deux.cherche_khi_deux(seuil_signification, k - 1)

    print(f"k theorique = {k_theorique}")
    accepte = k_observe <= k_theorique

    tempstr = "acceptee" if accepte else "rejetee"

    print(f"Au risque de se tromper de {seuil_signification*100} %, l'on peut dire que l'hypothese H0 est {tempstr}")
    # Data to be written
    dictionary = {
        "kt": k_theorique,
        "ko": k_observe,
        "msg": f"Au risque de se tromper de {seuil_signification*100} %, l'on peut dire que l'hypothese H0 est {tempstr}",
    }

    with open("../data-analysis/backend/shared/result.json", "w") as outfile:
        json.dump(dictionary, outfile)

else:
    variances = [echantillons[0].variance,echantillons[1].variance]
    f_observe = max(variances)/min(variances)
    f_critique = stats.f.ppf(1-seuil_signification , echantillons[0].taille - 1 , echantillons[0].taille - 1)
    accepte = f_observe <= f_critique
    print(f"f observe est : {f_observe}")
    print(f"f critique est : {f_critique}")
    tempstr = "accepte" if accepte else "rejetee"

    print(f"Au risque de se tromper de {seuil_signification*100} %, l'on peut dire que l'hypothese H0 est {tempstr}")
    # Data to be written
    dictionary = {
        "kt": f_critique,
        "ko": f_observe,
        "msg": f"Au risque de se tromper de {seuil_signification*100} %, l'on peut dire que l'hypothese H0 est {tempstr}",
    }

    with open("../data-analysis/backend/shared/result.json", "w") as outfile:
        json.dump(dictionary, outfile)

