import sys
import primes
import math

# takes pub: public key and plain: plain text and returns cipher text


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


def Paillierencrypt(pub, plain):
    pub = PaillierPublicKey(int(pub))
    while True:
        r = primes.generate_prime(int(round(math.log(pub.n, 2))))
        if r > 0 and r < pub.n:
            break
    x = pow(r, int(pub.n), pub.n_sq)
    cipher = (pow(pub.g, int(plain), pub.n_sq) * x) % pub.n_sq
    return cipher


def RSAencrypt(pub, m):
    n, e = pub.split()
    c = pow(int(m), int(e), int(n))
    return c


if __name__ == "__main__":
    print(Paillierencrypt(sys.argv[1], sys.argv[3]))
    print(RSAencrypt(sys.argv[2], sys.argv[3]))
