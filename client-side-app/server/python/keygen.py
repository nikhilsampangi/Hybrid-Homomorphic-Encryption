import math
import primes


def invmod(a, m):
    m0 = m
    y = 0
    x = 1
    if (m == 1):
        return 0
    while (a > 1):
        q = a // m
        t = m
        m = a % m
        a = t
        t = y
        y = x - q * y
        x = t
    if (x < 0):
        x = x + m0
    return x


def lcm(a, b):
    return abs(a*b) // math.gcd(a, b)


class PaillierPrivateKey(object):
    def __init__(self, p, q, n):
        self.l = (p-1) * (q-1)
        self.m = invmod(self.l, n)

    def __repr__(self):
        return '%s %s' % (self.l, self.m)


class PaillierPublicKey(object):
    @classmethod
    def from_n(cls, n):
        return cls(n)

    def __init__(self, n):
        self.n = n
        self.n_sq = n * n
        self.g = n + 1

    def __repr__(self):
        return '%s' % self.n


class RSAPrivateKey(object):
    def __init__(self, n, d):
        self.n = n
        self.d = d

    def __repr__(self):
        return '%s' % (self.d)


class RSAPublicKey(object):
    def __init__(self, n, e):
        self.n = n
        self.e = e

    def __repr__(self):
        return '%s %s' % (self.n, self.e)


def generate_keypair(bits):
    p = primes.generate_prime(bits / 2)
    q = primes.generate_prime(bits / 2)
    n = p * q
    l = lcm(p-1, q-1)
    e = 65537
    d = invmod(e, l)
    return PaillierPrivateKey(p, q, n), PaillierPublicKey(n), RSAPrivateKey(n, d), RSAPublicKey(n, e)


if __name__ == "__main__":
    # 512 bits long key
    Priv_key1, Pub_key1, Priv_key2, Pub_key2 = generate_keypair(512)
    print(Priv_key1)
    print(Pub_key1)
    print(Priv_key2)
    print(Pub_key2)
