(this.webpackJsonpddo_audit=this.webpackJsonpddo_audit||[]).push([[10],{121:function(e,t,a){"use strict";var n=a(0),r=a.n(n);t.a=function(e){return r.a.createElement("div",null,e.data?r.a.createElement("p",null,"There are currently"," ",r.a.createElement("span",{className:"population-number"},function(){var t=0;return e.data.forEach((function(a){a.id===e.server&&(t=a.data[a.data.length-1].y)})),t}().toString().replace(/\B(?=(\d{3})+(?!\d))/g,","))," ","players online and"," ",r.a.createElement("span",{className:"lfm-number"},"GET_LFM_COUNT")," LFMs posted."," ","Are you one of them?"):"Loading data...")}},122:function(e,t,a){"use strict";var n=a(0),r=a.n(n),i=a(96);t.a=function(){return r.a.createElement(i.a,{smallHeight:"200px",largeHeight:"1200px",style:{paddingTop:"20px",position:"absolute"},isExpandable:!0},r.a.createElement("h4",{style:{fontWeight:"bold"}},"What is DDO Audit?"),r.a.createElement("p",null,"DDO Audit is a real-time player and LFM tracking project for"," ",r.a.createElement("a",{href:"https://www.ddo.com/en",rel:"noopener noreferrer",target:"_blank"},"Dungeons and Dragons Online"),". We track the current player population and posted LFMs for each server and report that data in the form of interactable and easy to understand charts and graphs, and familiar tools like the Grouping and Who panels. Read more about the project on the About page."),r.a.createElement("h4",{style:{fontWeight:"bold"}},"We want you to be informed and stay connected"),r.a.createElement("ul",null,r.a.createElement("li",null,"One of the most common questions we've witnessed new players ask regards which server would be the most populated during their active play-time. Luckily, we've taken all the guesswork out of it! While ultimately your choice of server should be based on a variety of factors (interactions you have with other players, guilds with similar interests, etc.), choosing the server that has the most traffic for your given time zone is a great place to start."),r.a.createElement("li",null,"There are a few server status tools around the web, but we wanted everything easily accessible from one site. Check the current server status at a glance from the Servers page to see if your favorite server is currently online."),r.a.createElement("li",null,"An offline (out of game) LFM panel has been something of great interest to the DDO community, and we're proud to be hosting the first ever implementation of it! The offline LFM panel has been a great resource to help increase player engagement and offer convenience to those with multiple characters across multiple servers. Check the LFM panel before you login to choose the appropriate character, or setup notifications to never miss raid night again!")),r.a.createElement("h4",{style:{fontWeight:"bold"}},"Community-Oriented"),r.a.createElement("p",null,"We're dedicated to providing the DDO community with the most accurate and useful data possible. Most of the features on this website today were directly inspired or requested by community members on the DDO Forums, Discord server, Reddit, or YouTube channels. If you have any requests or suggestions, please reach out! You can find my contact information on the About page. See you in Eberron!"),r.a.createElement("center",null,r.a.createElement("span",{style:{fontSize:"larger"}},"Clemeit of Thelanis")))}},123:function(e,t,a){"use strict";var n=a(52),r=a(0),i=a.n(r),o=a(118),l={background:"var(--card)",textColor:"var(--text)",fontSize:14,axis:{domain:{line:{stroke:"#777777",strokeWidth:1}},ticks:{line:{stroke:"#777777",strokeWidth:2}}},grid:{line:{stroke:"#dddddd",strokeWidth:1}},crosshair:{line:{stroke:"var(--text)",strokeWidth:1,strokeOpacity:1,strokeDasharray:"6 6"}},tooltip:{container:{background:"var(--card)",color:"inherit",fontSize:"inherit",borderRadius:"2px",boxShadow:"0 0 6px var(--card-border)",padding:"5px 9px"},basic:{whiteSpace:"pre",display:"flex",alignItems:"center"},table:{},tableCell:{padding:"3px 5px"}}};t.a=function(e){var t=i.a.useState(null),a=Object(n.a)(t,2),r=a[0],s=a[1];return i.a.useEffect((function(){null!==e.data&&s(e.data.filter((function(t){return"Total"===t.id&"Combined Activity"===e.activeFilter||"Total"!==t.id&"Server Activity"===e.activeFilter||t.id===e.activeFilter})))}),[e.data,e.activeFilter]),i.a.createElement("div",{className:e.filters||e.showServerFilters?"chart-filterable":"",style:{height:"400px"}},e.data?i.a.createElement(o.a,{data:r,margin:{top:20,right:120,bottom:60,left:70},xScale:{type:"time",format:"%Y-%m-%dT%H:%M:%S.%LZ",useUTC:!1},xFormat:"time:%Y-%m-%dT%H:%M:%S",yScale:{type:"linear",min:0,max:"auto",stacked:!1,reverse:!1},curve:"natural",axisTop:null,axisRight:null,axisBottom:{orient:"bottom",tickSize:5,tickPadding:5,tickRotation:-45,legendPosition:"middle",tickValues:"day"===e.trendType?"every 1 hour":"week"===e.trendType?"every 6 hour":"every 1 week",format:"day"===e.trendType?"%-I:%M %p":"week"===e.trendType?"%a %-I %p":"%a %b %-d"},axisLeft:{orient:"left",tickSize:5,tickPadding:5,tickRotation:0,legend:"Players",legendOffset:-50,legendPosition:"middle"},lineWidth:4,enablePoints:!1,colors:function(e){return e.color},enableArea:"Server Activity"!==e.activeFilter,areaOpacity:.3,enableSlices:"x",useMesh:!0,legends:[{anchor:"right",direction:"column",justify:!1,translateX:120,translateY:0,itemsSpacing:0,itemDirection:"left-to-right",itemWidth:110,itemHeight:20,itemOpacity:1,symbolSize:12,symbolShape:"circle",symbolBorderColor:"rgba(0, 0, 0, .5)",effects:[{on:"hover",style:{itemOpacity:1}}]}],motionConfig:"stiff",theme:l}):i.a.createElement("div",{className:"loading-data-message"},i.a.createElement("h5",null,"Loading data...")))}},452:function(e,t,a){"use strict";a.r(t);var n=a(57),r=a.n(n),i=a(66),o=a(61),l=a(52),s=a(0),c=a.n(s),u=a(82),d=a(11),p=a(77),m=a(121),h=a(13),f=function(e){function t(e){return e.replace(/\B(?=(\d{3})+(?!\d))/g,",")}return c.a.createElement("div",{className:"card "+e.className},c.a.createElement("h2",{style:{fontSize:"x-large",fontWeight:"bold"}},"Quick Info"),c.a.createElement("ul",{style:{fontSize:"larger",lineHeight:"normal",paddingLeft:"20px"}},c.a.createElement("li",null,"The default server is"," ",null===e.data?"(Loading...)":c.a.createElement(h.a,{id:"default_server",className:"blue-link",to:"/servers?s="+e.data.DefaultServer.toLowerCase(),style:{textDecoration:"underline"}},e.data.DefaultServer)),c.a.createElement("li",null,"The most populated server is"," ",null===e.data?"(Loading...)":c.a.createElement(h.a,{id:"populous_server",className:"blue-link",to:"/servers?s="+e.data.DefaultServer.toLowerCase(),style:{textDecoration:"underline"}},e.data.DefaultServer)),c.a.createElement("li",null,"In the last quarter, we've seen"," ",c.a.createElement("span",{className:"population-number"},null===e.unique?"(Loading...)":function(){var a=0;return e.unique.forEach((function(e){a+=e.UniquePlayers})),t(a.toString())}())," ","unique characters and"," ",c.a.createElement("span",{className:"lfm-number"},null===e.unique?"(Loading...)":function(){var a=0;return e.unique.forEach((function(e){a+=e.UniqueGuilds})),t(a.toString())}())," ","unique guilds.")),c.a.createElement("hr",{style:{width:"80%",backgroundColor:"whitesmoke"}}),c.a.createElement("h2",{style:{fontSize:"x-large",fontWeight:"bold"}},"Of Special Note"),c.a.createElement("p",{style:{textAlign:"justify",fontSize:"larger",lineHeight:"normal"}},c.a.createElement("b",null,"March 24, 2021:")," Hardcore League Season 4 begins March 31, 2021! Find groups on the"," ",c.a.createElement(h.a,{to:"/grouping",className:"blue-link",style:{textDecoration:"underline"}},"Grouping page"),", lookup players on the"," ",c.a.createElement(h.a,{to:"/who",className:"blue-link",style:{textDecoration:"underline"}},"live Who list"),", and discover what builds other players are running on the"," ",c.a.createElement(h.a,{to:"/servers",className:"blue-link",style:{textDecoration:"underline"}},"Server page"),". See you in Eberron!"))},g=a(122),y=a(69),v=a(123),b=a(78);t.default=Object(d.c)()((function(e){var t=s.useState(null),a=Object(l.a)(t,2),n=a[0],c=a[1],d=s.useState(null),h=Object(l.a)(d,2),w=h[0],E=h[1],x=s.useState(null),S=Object(l.a)(x,2),k=S[0],O=S[1],j=s.useState(null),D=Object(l.a)(j,2),A=D[0],T=D[1],N=s.useState(null),L=Object(l.a)(N,2),F=L[0],C=L[1],W=s.useState(null),M=Object(l.a)(W,2),q=(M[0],M[1]);s.useEffect((function(){function e(e,a){return t.apply(this,arguments)}function t(){return(t=Object(i.a)(r.a.mark((function e(t,a){var n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:if(n=e.sent,"json"!==a){e.next=9;break}return e.next=6,n.json();case 6:n=e.sent,e.next=13;break;case 9:if("text"!==a){e.next=13;break}return e.next=12,n.text();case 12:n=e.sent;case 13:return e.abrupt("return",n);case 14:case"end":return e.stop()}}),e)})))).apply(this,arguments)}e("http://localhost:3001/api/v1/population/day","json").then((function(e){c(e)})).catch((function(e){var t;t={title:"Data failed to load",message:"Some of the data on this page failed to load.",icon:"warning",fullscreen:!1},le([].concat(Object(o.a)(oe),[t])),console.log([].concat(Object(o.a)(oe),[t]).length)})),e("http://localhost:3001/api/v1/population/week","json").then((function(e){E(e)})),e("http://localhost:3001/api/v1/population/quarter","json").then((function(e){O(e)})),e("https://www.playeraudit.com/api/quickinfo","json").then((function(e){T(e)})),e("https://www.playeraudit.com/api/uniquedata","json").then((function(e){C(e)})),e("https://www.playeraudit.com/api/serverstatus","json").then((function(e){if(q(e),e.hasOwnProperty("Worlds")){var t=[];e.Worlds.forEach((function(e){e.hasOwnProperty("Status")&&0===e.Status&&t.push(e.Name)})),t.length>=8?le([].concat(Object(o.a)(oe),[{messageType:"all servers offline"}])):t.length>1?le([].concat(Object(o.a)(oe),[{messageType:"some servers offline"}])):1===t.length&&("Hardcore"===t[0]||le([].concat(Object(o.a)(oe),[{title:t[0]+" Offline",message:t[0]+" appears to be temporarily offline.",icon:"info",fullscreen:!1}])))}else le([].concat(Object(o.a)(oe),[{title:"Something went wrong!",message:"The server list is missing. We're not sure if the servers are online or not. You'll have to login and check.",icon:"error"}]))}))}),[]);var H=s.useState("Server Activity"),z=Object(l.a)(H,2),P=z[0],R=z[1],I=s.useState("Server Activity"),U=Object(l.a)(I,2),_=U[0],Y=U[1],B=s.useState("Server Activity"),G=Object(l.a)(B,2),J=G[0],V=G[1],Q=s.useState("none"),X=Object(l.a)(Q,2),Z=X[0],K=X[1],$=s.useState(null),ee=Object(l.a)($,2),te=ee[0],ae=ee[1];function ne(e){var t={title:e.title,type:e.chartType,displayType:e.displayType,trendType:e.trendType,showActions:e.showActions};ae(t),K("block")}var re=s.useState([]),ie=Object(l.a)(re,2),oe=ie[0],le=ie[1];return s.useEffect((function(){}),[]),s.createElement("div",null,s.createElement(u.a,null,s.createElement("title",null,"DDO Audit"),s.createElement("meta",{name:"description",content:"A live summary of DDO's current player population and LFM status. View population trends, check server status, browse live grouping panels, and see what server is best for you!"})),s.createElement(y.a,{page:"home",visibility:Z,componentReference:te,hideReportForm:function(){K("none")}}),s.createElement(b.a,{messages:oe,popMessage:function(){if(oe.length){var e=Object(o.a)(oe);e=e.slice(1),le(e)}}}),s.createElement(g.a,null),s.createElement("div",{className:"home-card-splitter"},s.createElement(f,{className:"card home-card-splitter-pane1",data:A,unique:F}),s.createElement(p.a,{pageName:"",showLink:!0,className:"home-card-splitter-pane2",title:"Currently on Dungeons and Dragons Online",subtitle:s.createElement(m.a,{data:n,server:"Total"}),tiles:[{title:"Players and LFMs by Minute - All Servers",description:s.createElement("div",{className:"tile-description"},s.createElement("p",null,"A 24-hour rolling window of the total","Composite"===P?" population of each server":" game population",".")),content:s.createElement(v.a,{data:n,trendType:"day",activeFilter:P,filters:[{name:"Filter",reference:function(e){R(e)},options:["Server Activity","Combined Activity"],index:0}],showActions:!0,showLastUpdated:!0,reportReference:ne})}]})),s.createElement(p.a,{pageName:"",showLink:!0,title:"Recently on Dungeons and Dragons Online",subtitle:"",tiles:[{title:"Players and LFMs by Hour - All Servers",description:s.createElement("div",{className:"tile-description"},s.createElement("p",null,"A 1-week rolling window of the total","Composite"===_?" population of each server":" game population","."," ",s.createElement("span",{className:"blue-text"},"Hourly averages")," ","are displayed.")),content:s.createElement(v.a,{data:w,trendType:"week",activeFilter:_,filters:[{name:"Filter",reference:function(e){Y(e)},options:["Server Activity","Combined Activity"],index:0}],showActions:!0,showLastUpdated:!0,reportReference:ne})},{title:"Players and LFMs by Day - All Servers",description:s.createElement("div",{className:"tile-description"},s.createElement("p",null,"A 90-day rolling window of the total","Composite"===J?" population of each server":" game population","."," ",s.createElement("span",{className:"blue-text"},"Daily averages")," ","are displayed.")),content:s.createElement(v.a,{data:k,trendType:"quarter",activeFilter:J,filters:[{name:"Filter",reference:function(e){V(e)},options:["Server Activity","Combined Activity"],index:0}],showActions:!0,showLastUpdated:!0,reportReference:ne})}]}))}))},96:function(e,t,a){"use strict";var n=a(52),r=a(0),i=a.n(r),o=a(24);t.a=function(e){var t=i.a.useState("collapsed"),a=Object(n.a)(t,2),r=a[0],l=a[1];return i.a.createElement("div",{className:"card "+e.className,style:{maxHeight:"expanded"===r?e.largeHeight:e.smallHeight,transition:"max-height 400ms"}},i.a.createElement("div",{className:"expandable-gradient",style:{display:"expanded"===r?"none":"block"},onClick:function(){return l("expanded"===r?"collapsed":"expanded")}}),e.children,i.a.createElement("div",{style:{height:"25px"}}),i.a.createElement("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",cursor:"pointer",fontSize:"larger",position:"absolute",bottom:"2px",left:"0px",width:"100%"},onClick:function(){return l("expanded"===r?"collapsed":"expanded")}},i.a.createElement("div",null,"See ","expanded"===r?"less":"more",i.a.createElement(o.a,{className:"link-icon",width:30,height:30,style:{transform:"rotate("+("expanded"===r?"-180deg":"0deg")+")",transition:"transform 400ms"}}))))}}}]);
//# sourceMappingURL=10.380daea5.chunk.js.map