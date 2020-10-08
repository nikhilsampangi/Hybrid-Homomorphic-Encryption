import sys


def decrypt(priv, pub, cipher):
    d = int(priv)
    n, e = pub.split()
    plain = pow(int(cipher), d, int(n))
    return plain


if __name__ == "__main__":
    print((decrypt(sys.argv[1], sys.argv[2], sys.argv[3])))
