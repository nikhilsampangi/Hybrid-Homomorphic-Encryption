import sys


def modpow(base, exponent, modulus):
    # Modular exponent:
    #      c = b ^ e mod m
    #    Returns c.
    result = 1
    while exponent > 0:
        if exponent & 1 == 1:
            result = (result * base) % modulus
        exponent = exponent >> 1
        base = (base * base) % modulus
    return result


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


if __name__ == "__main__":
    if(sys.argv[1] == "5"):
        print(int(sys.argv[3])*int(sys.argv[4]))
    else:
        pub = PublicKey(int(sys.argv[2]))
        if(sys.argv[1] == "1"):
            # Adds one encrypted integer to another
            a, b = int(sys.argv[3]), int(sys.argv[4])
            print(a * b % pub.n_sq)
        elif(sys.argv[1] == "4"):
            # subtracts second integer from first
            a, b = int(sys.argv[3]), int(sys.argv[4])
            print((a * (b**(-1))) % pub.n_sq)
        elif(sys.argv[1] == "2"):
            # Adds constant to an encrypted integer
            a, n = int(sys.argv[3]), int(sys.argv[4])
            print(a * modpow(pub.g, n, pub.n_sq) % pub.n_sq)
        elif(sys.argv[1] == "3"):
            # Multiplies an encrypted integer by a constant
            a, n = int(sys.argv[3]), int(sys.argv[4])
            print(modpow(a, n, pub.n_sq))
