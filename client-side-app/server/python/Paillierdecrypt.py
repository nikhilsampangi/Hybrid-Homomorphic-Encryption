import sys


class PrivateKey(object):

    def __init__(self, p, q, n):
        self.l = (p-1) * (q-1)
        self.m = invmod(self.l, n)

    def __repr__(self):
        return '%s %s' % (self.l, self.m)


class PublicKey(object):
    @classmethod
    def from_n(cls, n):
        return cls(n)

    def __init__(self, n):
        self.n = n
        self.n_sq = n * n
        self.g = n + 1

    def __repr__(self):
        return '%s' % self.n


def decrypt(priv, pub, cipher):
    pub = PublicKey(int(pub))
    l, m = priv.split(" ")
    x = pow(int(cipher), int(l), pub.n_sq) - 1
    plain = ((x // pub.n) * int(m)) % pub.n
    return plain


if __name__ == "__main__":
    print((decrypt(sys.argv[1], sys.argv[2], sys.argv[3])))
