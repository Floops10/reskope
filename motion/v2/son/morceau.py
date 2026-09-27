"""Un morceau : les bus, les envois de réverbération et d'écho, le mixage final."""
import os
import numpy as np
from synthe import SR, ech, Piste, reponse, convoluer, echo, egaliseur, passe_haut, passe_bas, etagere, cloche, pompe, matricer, lire_sfx
import instruments as I


class Morceau:
    def __init__(self, duree, tempo, graine=1):
        self.duree, self.tempo = duree, tempo
        self.tp = 60.0 / tempo
        self.rng = np.random.default_rng(graine)
        noms = ['batterie', 'basse', 'nappe', 'melodie', 'bruitages', 'rev', 'echo']
        self.bus = {n: Piste(duree) for n in noms}
        self.envoi_rev = Piste(duree)
        self.envoi_echo = Piste(duree)
        self.frappes = []
        self._sfx = {}

    def temps(self, mesure, temps=0.0):
        """Mesure (depuis 0) et temps dans la mesure → secondes."""
        return (mesure * 4 + temps) * self.tp

    def sfx(self, nom):
        if nom not in self._sfx:
            self._sfx[nom] = lire_sfx(nom)
        return self._sfx[nom]

    def poser(self, bus, son, t, gain=1.0, pan=0.0, rev=0.0, ech_=0.0):
        self.bus[bus].poser(son, t, gain, pan)
        if rev:
            self.envoi_rev.poser(son, t, gain * rev, pan)
        if ech_:
            self.envoi_echo.poser(son, t, gain * ech_, pan)

    def kick(self, t, gain=1.0, **k):
        self.frappes.append(t)
        self.poser('batterie', I.grosse_caisse(self.rng, **k), t, gain)

    def mixer(self, sortie, pompe_nappe=0.45, pompe_melodie=0.15, rev=None, echo_temps=None, echo_retour=0.33):
        rev = rev if rev is not None else reponse(2.8, 0.02, 1.0, 11)
        # Envois : réverbération et écho.
        self.bus['rev'].g += convoluer(egaliseur(self.envoi_rev.g, lambda f: passe_haut(220, 2)(f) * passe_bas(9000, 1)(f)), rev) * 0.55
        et = echo_temps if echo_temps else self.tp * 0.75
        self.bus['echo'].g += echo(egaliseur(self.envoi_echo.g, passe_haut(300, 2)), et, echo_retour, 6) * 0.6
        # Le souffle sous la grosse caisse.
        g = pompe(self.duree, self.frappes, pompe_nappe, 0.16)
        self.bus['nappe'].g *= g[None, :self.bus['nappe'].g.shape[1]]
        g2 = pompe(self.duree, self.frappes, pompe_melodie, 0.12)
        for b in ('melodie', 'rev', 'echo'):
            self.bus[b].g *= g2[None, :self.bus[b].g.shape[1]]
        # Couleurs par bus.
        self.bus['basse'].g = egaliseur(self.bus['basse'].g, lambda f: passe_haut(32, 2)(f) * passe_bas(900, 2)(f))
        self.bus['nappe'].g = egaliseur(self.bus['nappe'].g, lambda f: passe_haut(120, 2)(f) * cloche(300, -1.5, 1.0)(f) * etagere(5000, -3, True)(f))
        self.bus['melodie'].g = egaliseur(self.bus['melodie'].g, passe_haut(180, 2))
        self.bus['batterie'].g = np.tanh(self.bus['batterie'].g * 1.15) / 1.15
        self.bus['bruitages'].g = egaliseur(self.bus['bruitages'].g, lambda f: passe_haut(30, 2)(f) * etagere(7000, -3, True)(f))
        # Le maître : un peu moins de sub et d'extrême aigu, un peu plus de corps.
        for b in self.bus.values():
            b.g = egaliseur(b.g, lambda f: etagere(55, -2.5, False)(f) * etagere(9000, -2.0, True)(f) * cloche(420, 1.2, 1.2)(f))
        return matricer(list(self.bus.values()), self.duree, sortie)
