import crypto from "crypto";

export function decryptResponse(responseFromApi: string) {
  const payload = JSON.parse(Buffer.from(responseFromApi, "base64").toString());
  const encryptedKey = Buffer.from(payload.key, "base64");
  const iv = Buffer.from(payload.iv, "base64");
  const encryptedData = Buffer.from(payload.data, "base64");

  const rawPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDsRDew4RtakBwo
Itrbg7jnv61EfQabopPswBb6xdL9uvWa3aT1KfmcWpDtUCslJH+Zxcuf/S8JuP66
ZsQqm1g6RkreYazKiWbh+xibiO18JP1ng0TF4ZZsSpstQYCvySwnWJkVa3UseRqZ
rcG6574mY2djOi7lRXBO2lLShR8Ni2uPQ7irGis7yJmp+Mx0K5XhkTFhH1OzzOl9
9EGWWkziodW7nw1kNGGeA51p1H2ZaJxqR+citbwISJVUmSE7/5CO0tlPufi0NOw0
AgWma9zb5vygQUWpc47m/Zrm/Xwl0DNQxcpzjh+v2zUlsgYHdGmuroT/WKyJi3eO
tnkHgEflAgMBAAECggEABkjVT1Pq3y5zRQRN7YpB7Gwrs6mA5twppd2JxVdmnC2A
Sjaz8QK0L3SKMEZUd3d9PHmUUF9dhE6F2eqVZ4vLJAa/OwFHHPpUD55sY2APiNPc
hZA/vo+YaYtVBSUd3M8m6L8EqYoHbZDpW7kvPaeodyK9bAuRDbPWPaAKlVZ8r4jL
mOugEkwU9nD2uSXONh3O2BFVwp3v3yH5wPaW67a4gdjia4OH2RQogDVaafN48JlN
9n9kY4VBlUmjp8uATQcJEy84f8krakh70rEkNxBOBRIsKwJPh0RzTvmDfF2wPFUC
cOJzYU5PWBJfhohW9OV8VAzBAWtGim/m/IXpy9zWywKBgQD3qd6YeK7EMQ3Snx+W
NP/p5s6qcIOwgVtlHmE0qxSJ6aa0cGLYyMmYPUk0fKu457a187CwqAMrnhznWoHT
emwiMujkXhVHO1QmXRwV3jNvEgbrEVzkjIhKndtVcsbenBSWRhiKnuI+I+gu3FCr
S03Eu+YdbNghD4hdttYiO/txnwKBgQD0OCOHCQJAYHp4fR2r1sZCsurUVDbYApEv
gsERIhx/YW8p8t7whP8gW/UQlqZb3A4/VDMEQib9M8mW/ALqiubh+VJryWF0KbHb
anJ5diGa+BxcZb8zSH+bZ8JmvSZFNR52610pHS3q3CD69qDnialQ3VcFRwHrPir5
Ht2JQyZ/+wKBgEakACbTPV4ec8fgtTy9z0TjHY2F3DoLG4uDF8zTA1+28mLDL56P
3th6mpfK+5wZE4dgg8RPl9/oEGx451DvuUoj5UPGBiG0LXNn2WvvXhJPPQPthuZ1
oyZNUlNUEp9KO6EFS1i2qud4jHBZTPUe3IbB5Yf9FMSRTp8UWI2ZOEYXAoGAT4eQ
mkLmxswkVeR4qyMQAVx+eJLMIWAEo7Iy6T9whFLYfpKm4zCMXJ9VmQdWOYfZ4+mp
i3N3evFIbrC2ymZdda1Zl9xGrit9zfRGPyOnIe42XiiMMUkktRj/B7IFKnh36UYQ
Wnk0IM16t/9kusHrr3fFBOTwzQi7udDBWBfUC80CgYEArx7XIYi6GmJTJb8Mmnz0
210k+E9q3W3JtkS23yX0TJeOhetbd7mQYyl0bY7i9jxUX9/kf1pIAN6VwP0cLCNp
EQvxWtPyC7CEwUwrV3cXGWSrfyT37ZnH1VmjOC+TXylOCG7hduFZn0Tv8HQICc4d
jUpezRgVGpU344bmmfnlISs=
-----END PRIVATE KEY-----`;


  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

  const aesKey = crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    encryptedKey
  );

  const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);

  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString());
}