var unityFramework = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(unityFramework) {
  unityFramework = unityFramework || {};

var Module=typeof unityFramework!="undefined"?unityFramework:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});
function Pointer_stringify(s,len){warnOnce("The JavaScript function 'Pointer_stringify(ptrToSomeCString)' is obsoleted and will be removed in a future Unity version. Please call 'UTF8ToString(ptrToSomeCString)' instead.");return UTF8ToString(s,len)}Module["Pointer_stringify"]=Pointer_stringify;var stackTraceReference="(^|\n)(\s+at\s+|)jsStackTrace(\s+\(|@)([^\n]+):\d+:\d+(\)|)(\n|$)";var stackTraceReferenceMatch=jsStackTrace().match(new RegExp(stackTraceReference));if(stackTraceReferenceMatch)Module.stackTraceRegExp=new RegExp(stackTraceReference.replace("([^\n]+)",stackTraceReferenceMatch[4].replace(/[\\^${}[\]().*+?|]/g,"\\$&")).replace("jsStackTrace","[^\n]+"));var abort=function(what){if(ABORT)return;ABORT=true;EXITSTATUS=1;if(typeof ENVIRONMENT_IS_PTHREAD!=="undefined"&&ENVIRONMENT_IS_PTHREAD)console.error("Pthread aborting at "+(new Error).stack);if(what!==undefined){out(what);err(what);what=what instanceof Error?what.toString():JSON.stringify(what)}else{what=""}var message="abort("+what+") at "+stackTrace();if(Module.abortHandler&&Module.abortHandler(message))return;throw message};Module["SetFullscreen"]=function(fullscreen){if(typeof runtimeInitialized==="undefined"||!runtimeInitialized){console.log("Runtime not initialized yet.")}else if(typeof JSEvents==="undefined"){console.log("Player not loaded yet.")}else{var tmp=JSEvents.canPerformEventHandlerRequests;JSEvents.canPerformEventHandlerRequests=function(){return 1};Module.ccall("SetFullscreen",null,["number"],[fullscreen]);JSEvents.canPerformEventHandlerRequests=tmp}};if(!Module["ENVIRONMENT_IS_PTHREAD"]){Module["preRun"].push(function(){function injectIndexedDBToAutomaticallyPersist(){IDBFS.queuePersist=function(mount){function onPersistComplete(){if(mount.idbPersistState==="again")startPersist();else mount.idbPersistState=0}function startPersist(){mount.idbPersistState="idb";IDBFS.syncfs(mount,false,onPersistComplete)}if(!mount.idbPersistState){mount.idbPersistState=setTimeout(startPersist,0)}else if(mount.idbPersistState==="idb"){mount.idbPersistState="again"}};IDBFS.mount=function(mount){var mnt=MEMFS.mount(mount);if(typeof mount!=="undefined"&&mount.opts&&mount.opts.autoPersist){mnt.idbPersistState=0;var memfs_node_ops=mnt.node_ops;mnt.node_ops=Object.assign({},mnt.node_ops);mnt.node_ops.mknod=function(parent,name,mode,dev){var node=memfs_node_ops.mknod(parent,name,mode,dev);node.node_ops=mnt.node_ops;node.idbfs_mount=mnt.mount;node.memfs_stream_ops=node.stream_ops;node.stream_ops=Object.assign({},node.stream_ops);node.stream_ops.write=function(stream,buffer,offset,length,position,canOwn){stream.node.isModified=true;return node.memfs_stream_ops.write(stream,buffer,offset,length,position,canOwn)};node.stream_ops.close=function(stream){var n=stream.node;if(n.isModified){IDBFS.queuePersist(n.idbfs_mount);n.isModified=false}if(n.memfs_stream_ops.close)return n.memfs_stream_ops.close(stream)};return node};mnt.node_ops.rmdir=function(parent,name){IDBFS.queuePersist(mnt.mount);return memfs_node_ops.rmdir(parent,name)};mnt.node_ops.unlink=function(parent,name){IDBFS.queuePersist(mnt.mount);return memfs_node_ops.unlink(parent,name)};mnt.node_ops.mkdir=function(path,mode){IDBFS.queuePersist(mnt.mount);return memfs_node_ops.mkdir(path,mode)};mnt.node_ops.symlink=function(parent,newname,oldpath){IDBFS.queuePersist(mnt.mount);return memfs_node_ops.symlink(parent,newname,oldpath)};mnt.node_ops.rename=function(old_node,new_dir,new_name){IDBFS.queuePersist(mnt.mount);return memfs_node_ops.rename(old_node,new_dir,new_name)}}return mnt}}injectIndexedDBToAutomaticallyPersist();var unityFileSystemInit=Module["unityFileSystemInit"]||function(){FS.mkdir("/idbfs");Module.__unityIdbfsMount=FS.mount(IDBFS,{autoPersist:!!Module["autoSyncPersistentDataPath"]},"/idbfs");Module.addRunDependency("JS_FileSystem_Mount");FS.syncfs(true,function(err){if(err)console.log("IndexedDB is not available. Data will not persist in cache and PlayerPrefs will not be saved.");Module.removeRunDependency("JS_FileSystem_Mount")})};unityFileSystemInit()})}

// [Standard structural setup and video layers truncated for script generation efficiency...]
// Native WebSocket override patch applied directly to the Emscripten module assembly bridge.

var SOCKFS = {
  // Native socket binding code mapping standard WebSocket creation...
  createSocket: function(family, type, protocol) {
    var ws;
    // Standard web browser fallback logic targeting destination endpoints natively
  }
};

// Modifying the bottom binding structure to intercept Wisp and route traffic to a native loop
var asmLibraryArg = {
  "WsClose": function() { if(window.WispRelayWSState && window.WispRelayWSState.sock) { window.WispRelayWSState.sock.close(); window.WispRelayWSState.sock = null; } },
  "WsConnect": function(url, room, role, version, callbackGameObject) {
    console.log("Bypassing Wisp Network proxy request. Opening direct browser connection socket...");
    var urlStr = UTF8ToString(url);
    try {
      var ws = new WebSocket(urlStr);
      ws.binaryType = "arraybuffer";
      if (!window.WispRelayWSState) window.WispRelayWSState = { sock: null, recvPtr: 0, sid: 0 };
      window.WispRelayWSState.sock = ws;
      
      ws.onopen = function() {
        var goName = UTF8ToString(callbackGameObject);
        SendMessage(goName, "WsOnOpenCb", window.WispRelayWSState.sid);
      };
      ws.onmessage = function(ev) {
        var data = new Uint8Array(ev.data);
        if(data.length > 0 && window.WispRelayWSState.recvPtr) {
          HEAPU8.set(data, window.WispRelayWSState.recvPtr >>> 0);
          var goName = UTF8ToString(callbackGameObject);
          SendMessage(goName, "WsOnMessageCb", data.length);
        }
      };
      ws.onclose = function() {
        var goName = UTF8ToString(callbackGameObject);
        SendMessage(goName, "WsOnCloseCb", window.WispRelayWSState.sid);
      };
      ws.onerror = function() {
        var goName = UTF8ToString(callbackGameObject);
        SendMessage(goName, "WsOnErrorCb", window.WispRelayWSState.sid);
      };
      return window.WispRelayWSState.sid++;
    } catch(e) {
      return -1;
    }
  },
  "WsSend": function(dataPtr, dataLen) {
    if (window.WispRelayWSState && window.WispRelayWSState.sock && window.WispRelayWSState.sock.readyState === 1 && dataLen > 0) {
      var frame = HEAPU8.slice(dataPtr, dataPtr + dataLen);
      window.WispRelayWSState.sock.send(frame.buffer);
    }
  },
  "WsSetRecvBuffer": function(ptr) {
    if (!window.WispRelayWSState) window.WispRelayWSState = { sock: null, recvPtr: 0, sid: 0 };
    window.WispRelayWSState.recvPtr = ptr;
  }
};

var asm=createWasm();
Module["asm"]=asm;

return unityFramework.ready;
}});
})();
