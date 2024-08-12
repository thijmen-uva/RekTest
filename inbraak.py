import requests
from enum import Enum
import asyncio
import json
import pprint
from pyrekordbox import Rekordbox6Database

db = Rekordbox6Database(key="402fd482c38817c35ffa8ffb8c7d93143b749e7d315df7a81732a1ff43608497")
get_playlists_url = 'http://localhost:5173/get_all_user_playlists'
get_playlist_items_url = 'http://localhost:5173/get_spotify_playlist_items/'

class Type(Enum):
    rekordbox = 1
    spotify = 2

class Song:
    def __init__(self, Title, Artist, Type, Id):
        self.Title = Title
        self.Artist = Artist
        self.Type = Type
        self.Id = Id

    def __repr__(self):
        return (self.Title or 'Unkown') + ' - ' + (self.Artist or 'Unkown')
    
    def __eq__(self, other):
        return self.Title == other.Title and self.Artist == other.Artist

class Playlist:
    def __init__(self, Name: str, Songs: list[Song], playlist_type: Type, Id: str):
        self.Name: str = Name
        self.Songs: list[Song] = Songs
        self.Id: str = Id
        self.Type: Type = playlist_type

    def __repr__(self):
        return self.Name + ' - ' + self.Type.name + '\n' + '\n'.join(map(str, self.Songs))

    def __eq__(self, other):
        return self.Name == other.Name

class SpotifyManager:
    def __init__(self, get_playlists_url: str, get_playlist_items_url: str):
        self.get_playlists_url: str = get_playlists_url
        self.get_playlist_items_url: str = get_playlist_items_url
        self.playlists: list[Playlist] = []
        self.songs: list[Song] = []
        self.playlist_id: str = None
        self.playlist_name: str = None

    def __repr__(self):
        if self.playlist_id is None:
            return "No playlist selected" + "\n" + "Playlists: \n" + '\n'.join(map(str, self.playlists))
        return "Playlist name: " + self.playlist_name + " - " + self.playlist_id + "\n" + "Songs: \n" + '\n'.join(map(str, self.songs))

    def get_playlists(self):
        self.playlists = []
        response = requests.get(self.get_playlists_url)
        if response.status_code == 200:
            for playlist in response.json():
                self.playlists.append(Playlist(playlist['name'], [], Type.spotify ,playlist['id']))
        else:
            return []

    def find_playlist(self, name):
        for playlist in self.playlists:
            if playlist.Name == name:
                print(playlist)
                self.playlist_id = playlist.Id
                self.playlist_name = playlist.Name
                return self.get_playlist_items(playlist.Id);
        print('Playlist not found')
        return None
    
    def get_playlist_items(self, id):
        response = requests.get(self.get_playlist_items_url + id)
        if response.status_code == 200:
            songs = response.json()
            for song in songs:
                self.songs.append(Song(song['track']['name'], song['track']['artists'][0]['name'], Type.spotify, song['track']['id']))
            return self.songs

        else:
            return []

class RekordboxManager:
    def __init__(self, db: Rekordbox6Database):
        self.songs: list[Song] = []
        self.playlists = []
        self.db: Rekordbox6Database = db
        self.playlist_id: str = None
        self.playlist_name: str = None
        self.get_playlists()
        self.get_songs()
        self.found_playlist = None

    def __repr__(self):
        if self.playlist_id is None:
            return "No playlist selected" + "\n" + "Playlists: \n" + '\n'.join(map(str, self.playlists))
        return "Playlist name: " + self.playlist_name + " - " + self.playlist_id + "\n" + "Songs: \n" + '\n'.join(map(str, self.songs))
    def commit(self):
        self.db.commit()

    def get_playlists(self):
        playlists = self.db.get_playlist()
        for playlist in playlists:
            self.playlists.append(playlist)
        return self.playlists
    
    def add_to_playlist(self, id):
        print(id)
        self.db.add_to_playlist(self.found_playlist, id)
        print(self.db.commit())
        return

    def get_songs(self):
        songs = self.db.get_content()
        self.songs = []
        for song in songs:
            self.songs.append(Song(song.Title, song.ArtistName, Type.rekordbox, song.ID))
        return self.songs
    
    def find_playlist(self, name):
        for playlist in self.playlists:
            if playlist.Name == name:
                self.playlist_id = playlist.ID
                self.found_playlist = playlist
                return playlist
        return None
    
    def find_song(self, song):
        for s in self.songs:
            if s == song:
                return s
        return None

def main():
    rekordbox = RekordboxManager(db)
    spotify = SpotifyManager(get_playlists_url, get_playlist_items_url)
    spotify.get_playlists()
    spotify_songs = spotify.find_playlist('Prom n bass')
    songs = db.get_content()
    list_rekordbox = []
    for song in spotify.songs:
        rekordbox_song = rekordbox.find_song(song)
        if rekordbox_song is None:
            print('Song not found')
            print(song)
            found = db.search_content(song.Title)
            print(found)
            # print('Found song', found.Content.Title, found.Content.ArtistName)
            # input('Press enter to add to playlist')
            # rekordbox.add_to_playlist(found.Content.ID)
        else:
            list_rekordbox.append(rekordbox_song.Id)
    pprint.pprint(list_rekordbox)
    # result = db.search_content('Monty')
    # for r in result:
    #     db.add_to_playlist(playlist, r)
    # db.commit()


if __name__ == "__main__":
    main()