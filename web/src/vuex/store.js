import Vue from 'vue'
import Vuex from 'vuex'


import api from './modules/api'
import developer from './modules/developer'
import doc from './modules/doc'
import index from './modules/index'
import admin from './modules/admin'
import user from './modules/user'
import app from './modules/app'
import server from './modules/server'

Vue.use(Vuex)

const store = new Vuex.Store({

    modules: {
        api, developer, doc, index, admin, user,app,server
    }

})

export default store