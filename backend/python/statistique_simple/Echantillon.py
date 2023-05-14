import numpy as np


class Echantillon:

    def __init__(self, element):
        self.elements = np.asarray(element, dtype='int')

        self.taille = len(element)
        self.total = sum(self.elements)
        # ici on doit calculer la moyenne

        self.moyenne = self.total/self.taille

        temp = [(self.elements[i] - self.moyenne)**2 for i in range(self.taille)]
        self.variance = sum(temp)/(self.taille - 1)

    def affiche(self):
        print(self.elements)


# if __name__ == "Echantillons"