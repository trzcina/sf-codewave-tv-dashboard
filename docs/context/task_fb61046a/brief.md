# Brief: dashboard TV CodeWave

Cel: stała strona wyświetlana na telewizorze w biurze firmy CodeWave. Na razie pokazuje godzinę, datę, imieniny i rotujące hasła firmy.

Decyzje użytkownika:
- Nazwa firmy: CodeWave.
- Hasło podstawowe: „Razem budujemy przyszłość”. Hasła mają rotować (kilka). Dwa pozostałe („Każda linia kodu ma znaczenie”, „Dobry kod to wspólna sprawa”) to propozycje projektanta — użytkownik podmieni je w Flotiq.
- Ciemne tło.
- Układ: zegar po lewej, data / imieniny / hasło po prawej.
- Wybrany wariant: B (hasło na czerwonym bloku w dolnej części prawej kolumny).
- W przyszłości dojdą moduły: pogoda, urodziny pracowników, ogłoszenia, kalendarz wydarzeń — w stopce zostawiono na nie 4 komórki.
- Nazwa firmy, imieniny i hasła do rotacji mają pochodzić z Flotiq headless CMS.

System wizualny: „Modernist” — płaski, architektoniczny, wyłącznie Archivo, jeden akcent czerwony #ec3013, zero zaokrągleń, mocne linie 2px, widoczna siatka, wszystko wyrównane do lewej. Wersja ciemna: tło #201e1d, tekst #f3f2f2, linie rgba(243,242,242,0.3), tekst pomocniczy #bab6b6, czerwony tekst na ciemnym #ff563c, pola czerwone #ec3013, nieaktywne wskaźniki na czerwonym #ae1800, tor paska postępu #3a3736, tekst „w przygotowaniu” #7d7979.

Imieniny w namedays.txt zostały spisane z pamięci — warto je zweryfikować, ale jako dane startowe są OK.