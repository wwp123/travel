//jQuery.noConflict();//解决多库冲突问题
var Class = { // 全局静态类, 用于声明一个新的类并提供构造函数支持
create: function() {
	return function() { // 返回一个函数, 代表着这个新声明的类的构造函数
		// 一个命名为initialize的函数将被这个类实现作为类的构造函数
		this.initialize.apply(this,arguments);// initialize函数将在你实例化一个变量的时候被调用执行

		}

	}
}
var Tag = Class.create();//类的声明
Tag.prototype = {
		initialize:function(id,param){//构造函数
			this.id = id;//id参数			
			this.param = param;
		},			
		//成员函数
		setDataParser1:function(func){//下拉框的数据解析器
			this.dataParser1 = func;
		},
		setDataParser2:function(func){//推荐框的数据解析器
			this.dataParser2 = func;
		},
		setOnchange:function(js){//值改变时触发的事件
			return	this.change=js;	
		},
		loadTag:function(){//加载tag插件;
			var self = this;//插件自身对象
			if(this.param.remark!="null"&&this.param.remark!=undefined&&this.param.remark!=""){
					jQuery('#'+this.id+'').html('<input type=\"hidden\" id="input-'+this.id+'" name="'+this.id+'" class=\"tags\"/>'
						+'<label id="r-'+this.id+'" style="float:left;">'+this.param.remark+'</label>'
						+'<div id="mycard-'+this.id+'" style="display:none;">' //推荐
						+'<div class="default-tag tagbtn">'
						+'<div id="reco-'+this.id+'"></div></div></div>');
			}else{
				jQuery('#'+this.id+'').html('<input type=\"hidden\" id="input-'+this.id+'" name="'+this.id+'" class=\"tags\"/>'
				+'<div id="mycard-'+this.id+'" style="display:none;">' //推荐
			    +'<div class="default-tag tagbtn">'
			    +'<div id="reco-'+this.id+'"></div></div></div>');
			}
			if(this.param.listUrl!=""&&this.param.listUrl!=undefined&&this.param.listUrl!=null){//listUrl下拉框中的数据路径不为空
				jQuery('#input-'+this.id+'').select2({	
					width:this.param.width,
					tags: true,
					tokenSeparators: [',',' '],
					placeholder: (this.param.grayTip=='null'? "标签输入用回车、空格、或逗号隔开" : this.param.grayTip),
					multiple: true,
					maximumSelectionSize:this.param.maxInput,
					ajax: {
					    url:this.param.listUrl,//获取数据的路径
						dataType: 'json',
					    data: function(term) {   //data:"term"将数据发送到服务器
					          return { q: term};   //返回json格式的"term"数据
					          },  
					    results: function(data) {//服务器返回的数据
					    	if(self.param.isdataPs1){
					    		var arr=new Array();
					    		 jQuery.each(data, function (i, val) { 
					    			 arr[i]=self.dataParser1(val);					    	
					    		 });
					    		 data=arr;
					    		return{results:data};	
					    	}
					    	else{
					    		return { results: data}; 
					          }
					    	}    
					    },
					createSearchChoice: function (term,data) {//创建查询选项term为输入的值     
		            	var text = term + (data.some(function(r) {return r.text == term;}) ? "" : " (新标签)");
		            
		            	if(text== term){
					        return ;
					        }
					    else{
					        return { id: text,text: text };	//	id: term,text: text		        
					        }
			            },
			            formatResult: function (term) {//设定查询结果样式,"term"表示用户输入的搜索字符串
			            		return "<div class='select2-user-result'>" +term.text +"</div>";		
			                
			            },
			            formatSelection: function (term) {//选择数据后，返回显示在文本框中的数据
			 
			            	if(term.text.indexOf("(新标签)")>0){//检查字符串中是否存在"(new)"子串
			            	return	term.text.replace(" (新标签)","");
			            	}
			            	else{
			            		return term.text;
			            	}
			            }
					  });
				if(this.param.isReco==true){
					this.loadReco();
				}
			 }
			else {
				jQuery('#input-'+this.id+'').select2({			
					tags:this.param.tagVal,
					tokenSeparators: [',',' '],
					placeholder: "最多只输入"+this.param.maxInput+"个标签且标签用',''空格'隔开",
					multiple: true,
					maximumSelectionSize:this.param.maxInput					
				});
				if(this.param.isReco==true){
					this.loadReco();
				}
			};
			if(this.param.setValue!=null&&this.param.setValue!=undefined&&this.param.setValue!=""){//赋初始值
				var setVl = this.param.setValue;
				var set = jQuery.parseJSON(setVl);
				var arr = new Array();
				jQuery.each(set,function(i,val){
					var s=self.dataParser1(val);
					arr.push(s);
				});
				jQuery('#input-'+this.id+'').select2('data',arr).trigger("change");//赋初始值
			}
		},
		loadReco:function(){//加载推荐
			var self = this;
			var childId=this.id;
			var maxInput=this.param.maxInput;
			if(this.param.recoUrl!=""&&this.param.recoUrl!=undefined &&this.param.recoUrl!=null){//推荐路径不为空
				jQuery.ajax({  
					type: "POST",  
					dataType: "json",
					url: this.param.recoUrl,  
					success: function (data) {   
					   jQuery.each(data, function (i, val) { 
						   val=self.dataParser2(val);
						  if(self.param.isdataPs2){//是否需要数据解析		
							   jQuery('#reco-'+self.id+'').append(
									'<a id=\"tag_0'+i+'\" title=\"'+val.text+'\"'
					                +' href="javascript:void(0);">'
					                +'+'
					                +'<span>'+val.text+'</span><em></em></a>');
							   if (val.isSystem=="1") {//如果是系统标签
							   	jQuery('#tag_0'+i+'').addClass("isSystem-tag");
							   };
						   }
						   else{
							   jQuery('#reco-'+self.id+'').append(
								     '<a id=\"tag_0'+i+'\" title=\"'+val.text+'\"'
							         +' href="javascript:void(0);">'
							         + +'+'
						             +'<span>'+val.text+'</span><em></em></a>');
							    if (val.isSystem=="1") {
							   	jQuery('#tag_0'+i+'').addClass("isSystem-tag");
							   };
						   	}
					    jQuery('#tag_0'+i+'').click(function () {
					    	 //将div中推荐tag绑定到input中
					    	  var it = jQuery('#input-'+childId+''),					    	 
					    	  	  vl = it.select2('data'),
					    	  	  nvl = val;
					    	  //标记已经选择的标签
							 jQuery(this).addClass('tag-selected');
					    	  if (vl && vl.length > 0) {
					    		  if (vl.length >= maxInput) {//限制标签输入的个数
					    			  alert('只能输入'+vl.length+'个标签');
					    			  return ;
					    		  }
					    		  vl.push(val);
					    		  nvl = vl;
					    	  }
					    	  it.select2('data', nvl).trigger("change");					    	  
					      });		    	 
					   });	
					      jQuery('#input-'+childId+'').on("select2-removed", function(e) {
					     var k;
					     jQuery.each(data, function (n, value) { 
					     	  value=self.dataParser2(value);
					     	if(e.val == value.text){
					     		k = n;
					     	}
					     })
					      jQuery('#tag_0'+k+'').removeClass('tag-selected');
					  }); 
					},		
				});  
			jQuery('#mycard-'+this.id+'').show();//显示推荐层
			}		
		}
};
