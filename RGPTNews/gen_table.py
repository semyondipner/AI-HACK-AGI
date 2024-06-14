""" Functions for generating reports """

def gen_from_json(data):
    """ Generates HTML from Json Output from ResearchGPT """
    news_list = []
    for i in range(data.shape[0]):
        string = data.loc[i]
        html_block_template = f"""
        <tr>
            <td width="50%" style="padding:15px 15px 0 15px;">
                <div style="padding:20px;background-color:#ffffff;border-radius:6px;">
                    <p align="right" style="color:#70819A;margin:0;">{string.date_time}</p>
                    <h3 style="color:#112542;margin: 10px 0 0 0;"><a target="_blank" href="{string.article_name}">{string.title}</a></h3>
                    <table>
                        <tr>
                            <td style="width: 100%;">
                                <p style="color:#70819A;">{string.source_name}
                                </p>
                            </td>
                            <td style="text-align: right;">
                                <p align="right"
                                   style="font-size:10px;background-color:#B0EBDD;color:#112542;padding:5px;min-width:max-content;">
                                    {string.category}</p>
                            </td>
                        </tr>
                    </table>

                    <p style="color:#112542;margin: 0 0 10px 0;">{string.summary}</p>
                    <div style="margin-top:10px;padding:5px 20px 5px 20px;background-color:#3c7dff4d;border-radius: 6px;">
                        <p style="font-size:12px;color:#112542;"><b>{string.importance}</b></p></div>
                </div>
            </td>
        </tr>
        """
        news_list.append(html_block_template)
    return ''.join(news_list)
