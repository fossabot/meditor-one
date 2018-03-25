import { firebaseAction } from 'vuexfire';
import { find, findMany, findAll } from './helpers/getter';
import { update as updateLocal } from './helpers/mutation';
import { create, update, remove } from './helpers/action';
import { dbFoldersRef } from '../../firebase-config';

const state = {
  folders: []
};

const getters = {
  findFolder: state => (key, value) => {
    if (!state.folders) return null;

    return find(state.folders, key, value);
  },

  findManyFolders: state => ids => {
    if (!state.folders) return [];

    return findMany(state.folders, ids);
  },

  findAllFolderCompletions: (
    state,
    getters,
    rootState,
    rootGetters
  ) => kind => {
    if (!state.folders) return [];

    let completions = [];

    findAll(state.folders)
      .filter(folder => folder.files && Object.keys(folder.files).length > 0)
      .forEach(folder => {
        Object.keys(folder.files).forEach(id => {
          let file = rootGetters.findFile('.key', id);
          if (!file) {
            // state.updateFolder({ id, key: 'files', value: null });
            throw new Error(
              `Folder with id ${
                folder['.key']
              } holds a reference (${id}) to a non-existant child`
            );
          }

          completions.push({
            label: `${folder.name.toLowerCase()} ${file.name.toLowerCase()}`,
            insertText: { value: file.value },
            kind
          });
        });
      });

    return completions;
  }
};

const mutations = {
  updateFolderLocal(state, { id, key, value }) {
    updateLocal(state.folders, id, key, value);
  }
};

const actions = {
  syncFolders: firebaseAction(({ bindFirebaseRef }, ref) => {
    bindFirebaseRef('folders', ref);
  }),

  createFolder: ({ state, dispatch }, { parent, folder }) => {
    return create(dbFoldersRef, folder, child => {
      return {
        [`/folders/${parent}/folders/${child}`]: true,
        [`/folders/${child}/folder/${parent}`]: true
      };
    });
  },

  updateFolder: (state, payload) => {
    return update(dbFoldersRef, payload);
  },

  removeFolder: (state, id) => {
    return remove(dbFoldersRef, id);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};